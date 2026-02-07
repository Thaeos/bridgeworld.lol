# FrenEvolution - 2D NFT to 3D Character Evolution System
#
# As AI Frens traverse, interact, and build on Arbitrum:
# - Their minted NFT image becomes the basis for a 3D character
# - Activity on-chain increases their "evolution level"
# - More interactions = more detailed 3D representation
# - Building contracts = unlocks new 3D features/accessories

extends Node

class_name FrenEvolution

# ============================================================================
# SIGNALS
# ============================================================================

signal fren_registered(fren_address: String, nft_data: Dictionary)
signal fren_evolved(fren_address: String, new_level: int, model: Node3D)
signal fren_activity_recorded(fren_address: String, activity_type: String, points: int)
signal fren_3d_ready(fren_address: String, model: Node3D)

# ============================================================================
# CONSTANTS
# ============================================================================

# Evolution thresholds (activity points needed)
const EVOLUTION_LEVELS = {
	0: {"name": "2D Sprite", "points": 0, "dimension": "2D"},
	1: {"name": "Flat 3D", "points": 100, "dimension": "2.5D"},      # Billboard in 3D space
	2: {"name": "Low Poly", "points": 500, "dimension": "3D"},       # Basic 3D mesh
	3: {"name": "Detailed", "points": 2000, "dimension": "3D"},      # Detailed mesh
	4: {"name": "Animated", "points": 5000, "dimension": "3D"},      # With animations
	5: {"name": "Legendary", "points": 15000, "dimension": "3D"}     # Full features + effects
}

# Activity point values
const ACTIVITY_POINTS = {
	"transaction_sent": 1,
	"transaction_received": 1,
	"contract_interaction": 5,
	"defi_swap": 10,
	"defi_supply": 15,
	"nft_mint": 20,
	"nft_trade": 10,
	"cross_chain_bridge": 25,
	"glyph_execution": 30,
	"contract_deployed": 100,
	"guild_joined": 50,
	"guild_created": 200,
	"crafting_recipe_created": 75,
	"ai_bot_registered": 150
}

# 3D feature unlocks by level
const FEATURE_UNLOCKS = {
	1: ["depth_layer"],
	2: ["basic_mesh", "shadow"],
	3: ["facial_features", "body_details", "accessories_slot"],
	4: ["idle_animation", "walk_animation", "interact_animation"],
	5: ["particle_aura", "special_effects", "custom_animations", "emotes"]
}

# ============================================================================
# STATE
# ============================================================================

var _engine: ArbitrumEngine
var _frens: Dictionary = {}  # address -> FrenData
var _activity_cache: Dictionary = {}  # address -> Array of activities

# ============================================================================
# FREN DATA STRUCTURE
# ============================================================================

class FrenData:
	var address: String
	var nft_contract: String
	var nft_token_id: int
	var nft_image_url: String
	var nft_metadata: Dictionary
	var activity_points: int = 0
	var evolution_level: int = 0
	var traits: Dictionary = {}
	var unlocked_features: Array = []
	var model_3d: Node3D = null
	var texture_2d: Texture2D = null
	var registered_at: int = 0
	var last_activity: int = 0
	
	func get_evolution_progress() -> float:
		var current_threshold = FrenEvolution.EVOLUTION_LEVELS[evolution_level].points
		var next_level = min(evolution_level + 1, 5)
		var next_threshold = FrenEvolution.EVOLUTION_LEVELS[next_level].points
		
		if next_level == evolution_level:
			return 1.0
		
		var points_in_level = activity_points - current_threshold
		var points_needed = next_threshold - current_threshold
		return float(points_in_level) / float(points_needed)

# ============================================================================
# INITIALIZATION
# ============================================================================

func _ready():
	pass

func initialize(engine: ArbitrumEngine):
	_engine = engine
	_connect_engine_signals()

func _connect_engine_signals():
	if not _engine:
		return
	
	_engine.transaction_sent.connect(_on_fren_transaction)
	_engine.transaction_confirmed.connect(_on_fren_tx_confirmed)
	_engine.glyph_executed.connect(_on_fren_glyph_executed)
	_engine.cross_chain_message_sent.connect(_on_fren_cross_chain)
	_engine.nft_loaded.connect(_on_nft_loaded)

# ============================================================================
# FREN REGISTRATION
# ============================================================================

func register_fren(fren_address: String, nft_contract: String, nft_token_id: int) -> FrenData:
	var fren = FrenData.new()
	fren.address = fren_address.to_lower()
	fren.nft_contract = nft_contract
	fren.nft_token_id = nft_token_id
	fren.registered_at = Time.get_unix_time_from_system()
	
	_frens[fren.address] = fren
	
	# Load NFT data
	_load_fren_nft(fren)
	
	# Fetch historical activity
	_fetch_historical_activity(fren)
	
	fren_registered.emit(fren_address, {
		"nft_contract": nft_contract,
		"nft_token_id": nft_token_id
	})
	
	return fren

func _load_fren_nft(fren: FrenData):
	if not _engine:
		return
	
	var nft_data = await _engine.load_nft(fren.nft_contract, fren.nft_token_id)
	
	if nft_data.has("metadata"):
		fren.nft_metadata = nft_data.metadata
		fren.nft_image_url = nft_data.metadata.get("image", "")
		
		# Extract traits for 3D generation
		if nft_data.metadata.has("attributes"):
			for attr in nft_data.metadata.attributes:
				fren.traits[attr.trait_type] = attr.value
	
	if nft_data.has("texture"):
		fren.texture_2d = nft_data.texture
		
		# Start evolution process
		_evolve_fren(fren)

func _fetch_historical_activity(fren: FrenData):
	# Query on-chain history to calculate existing activity points
	# This would call an indexer or scan recent blocks
	# For now, initialize at 0
	pass

# ============================================================================
# ACTIVITY TRACKING
# ============================================================================

func record_activity(fren_address: String, activity_type: String):
	var address = fren_address.to_lower()
	
	if not _frens.has(address):
		return
	
	var fren = _frens[address]
	var points = ACTIVITY_POINTS.get(activity_type, 1)
	
	fren.activity_points += points
	fren.last_activity = Time.get_unix_time_from_system()
	
	# Cache activity
	if not _activity_cache.has(address):
		_activity_cache[address] = []
	_activity_cache[address].append({
		"type": activity_type,
		"points": points,
		"timestamp": fren.last_activity
	})
	
	fren_activity_recorded.emit(address, activity_type, points)
	
	# Check for evolution
	_check_evolution(fren)

func _on_fren_transaction(tx_hash: String):
	# Track for connected wallet (if it's a registered fren)
	if _engine and _frens.has(_engine.get_wallet_address().to_lower()):
		record_activity(_engine.get_wallet_address(), "transaction_sent")

func _on_fren_tx_confirmed(tx_hash: String, receipt: Dictionary):
	# Could analyze receipt to determine activity type
	pass

func _on_fren_glyph_executed(glyph_id: int, result: Dictionary):
	if _engine and _frens.has(_engine.get_wallet_address().to_lower()):
		record_activity(_engine.get_wallet_address(), "glyph_execution")

func _on_fren_cross_chain(dest_chain: int, message_id: String):
	if _engine and _frens.has(_engine.get_wallet_address().to_lower()):
		record_activity(_engine.get_wallet_address(), "cross_chain_bridge")

func _on_nft_loaded(token_id: int, metadata: Dictionary, texture: Texture2D):
	# Check if this NFT belongs to a registered fren
	pass

# ============================================================================
# EVOLUTION SYSTEM
# ============================================================================

func _check_evolution(fren: FrenData):
	var new_level = _calculate_evolution_level(fren.activity_points)
	
	if new_level > fren.evolution_level:
		fren.evolution_level = new_level
		
		# Unlock new features
		if FEATURE_UNLOCKS.has(new_level):
			for feature in FEATURE_UNLOCKS[new_level]:
				if not fren.unlocked_features.has(feature):
					fren.unlocked_features.append(feature)
		
		# Regenerate 3D model
		_evolve_fren(fren)
		
		fren_evolved.emit(fren.address, new_level, fren.model_3d)

func _calculate_evolution_level(points: int) -> int:
	var level = 0
	for lvl in EVOLUTION_LEVELS.keys():
		if points >= EVOLUTION_LEVELS[lvl].points:
			level = lvl
	return level

func _evolve_fren(fren: FrenData):
	match fren.evolution_level:
		0:
			_create_2d_sprite(fren)
		1:
			_create_billboard_3d(fren)
		2:
			_create_low_poly_mesh(fren)
		3:
			_create_detailed_mesh(fren)
		4:
			_create_animated_mesh(fren)
		5:
			_create_legendary_mesh(fren)

# ============================================================================
# 3D MODEL GENERATION
# ============================================================================

func _create_2d_sprite(fren: FrenData):
	# Level 0: Simple 2D sprite
	var sprite = Sprite2D.new()
	sprite.texture = fren.texture_2d
	sprite.name = "Fren_" + fren.address.substr(0, 8)
	
	# Store as placeholder (not true 3D yet)
	# fren.model_3d = sprite  # Note: This is 2D

func _create_billboard_3d(fren: FrenData):
	# Level 1: 2D image as billboard in 3D space
	var mesh_instance = MeshInstance3D.new()
	mesh_instance.name = "Fren_" + fren.address.substr(0, 8)
	
	# Create quad mesh
	var quad = QuadMesh.new()
	quad.size = Vector2(1.0, 1.0)
	mesh_instance.mesh = quad
	
	# Apply NFT texture
	var material = StandardMaterial3D.new()
	material.albedo_texture = fren.texture_2d
	material.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	material.billboard_mode = BaseMaterial3D.BILLBOARD_ENABLED
	mesh_instance.material_override = material
	
	fren.model_3d = mesh_instance
	fren_3d_ready.emit(fren.address, mesh_instance)

func _create_low_poly_mesh(fren: FrenData):
	# Level 2: Generate basic 3D mesh from 2D image
	var root = Node3D.new()
	root.name = "Fren_" + fren.address.substr(0, 8)
	
	# Body (capsule)
	var body = MeshInstance3D.new()
	body.name = "Body"
	var capsule = CapsuleMesh.new()
	capsule.radius = 0.3
	capsule.height = 1.2
	body.mesh = capsule
	
	# Extract dominant color from NFT for body
	var body_material = StandardMaterial3D.new()
	body_material.albedo_color = _extract_dominant_color(fren.texture_2d)
	body.material_override = body_material
	root.add_child(body)
	
	# Head (sphere with NFT texture)
	var head = MeshInstance3D.new()
	head.name = "Head"
	var sphere = SphereMesh.new()
	sphere.radius = 0.25
	head.mesh = sphere
	head.position = Vector3(0, 0.8, 0)
	
	var head_material = StandardMaterial3D.new()
	head_material.albedo_texture = fren.texture_2d
	head.material_override = head_material
	root.add_child(head)
	
	# Shadow
	if fren.unlocked_features.has("shadow"):
		var shadow = _create_shadow()
		root.add_child(shadow)
	
	fren.model_3d = root
	fren_3d_ready.emit(fren.address, root)

func _create_detailed_mesh(fren: FrenData):
	# Level 3: More detailed mesh with features
	var root = Node3D.new()
	root.name = "Fren_" + fren.address.substr(0, 8)
	
	# Body - more detailed shape
	var body = _generate_body_mesh(fren)
	root.add_child(body)
	
	# Head with facial features
	var head = _generate_head_mesh(fren)
	root.add_child(head)
	
	# Arms
	var left_arm = _generate_arm_mesh(fren, true)
	var right_arm = _generate_arm_mesh(fren, false)
	root.add_child(left_arm)
	root.add_child(right_arm)
	
	# Legs
	var left_leg = _generate_leg_mesh(fren, true)
	var right_leg = _generate_leg_mesh(fren, false)
	root.add_child(left_leg)
	root.add_child(right_leg)
	
	# Accessories based on traits
	if fren.unlocked_features.has("accessories_slot"):
		_add_trait_accessories(root, fren)
	
	# Shadow
	var shadow = _create_shadow()
	root.add_child(shadow)
	
	fren.model_3d = root
	fren_3d_ready.emit(fren.address, root)

func _create_animated_mesh(fren: FrenData):
	# Level 4: Detailed mesh with skeleton and animations
	var root = _create_detailed_mesh_base(fren)
	
	# Add skeleton
	var skeleton = Skeleton3D.new()
	skeleton.name = "Skeleton"
	
	# Create bone structure
	_setup_skeleton(skeleton)
	
	# Parent mesh to skeleton
	# ... bone attachment logic
	
	# Add animation player
	var anim_player = AnimationPlayer.new()
	anim_player.name = "AnimationPlayer"
	
	# Create animations
	if fren.unlocked_features.has("idle_animation"):
		_create_idle_animation(anim_player)
	if fren.unlocked_features.has("walk_animation"):
		_create_walk_animation(anim_player)
	if fren.unlocked_features.has("interact_animation"):
		_create_interact_animation(anim_player)
	
	root.add_child(skeleton)
	root.add_child(anim_player)
	
	fren.model_3d = root
	fren_3d_ready.emit(fren.address, root)

func _create_legendary_mesh(fren: FrenData):
	# Level 5: Full featured with particle effects
	var root = _create_animated_mesh_base(fren)
	
	# Particle aura
	if fren.unlocked_features.has("particle_aura"):
		var aura = _create_aura_particles(fren)
		root.add_child(aura)
	
	# Special effects based on activity history
	if fren.unlocked_features.has("special_effects"):
		_add_special_effects(root, fren)
	
	# Emote system
	if fren.unlocked_features.has("emotes"):
		var emote_controller = _create_emote_controller(fren)
		root.add_child(emote_controller)
	
	fren.model_3d = root
	fren_3d_ready.emit(fren.address, root)

# ============================================================================
# MESH GENERATION HELPERS
# ============================================================================

func _generate_body_mesh(fren: FrenData) -> MeshInstance3D:
	var mesh_instance = MeshInstance3D.new()
	mesh_instance.name = "Body"
	
	# Create tapered cylinder for body
	var mesh = CylinderMesh.new()
	mesh.top_radius = 0.25
	mesh.bottom_radius = 0.35
	mesh.height = 0.8
	mesh_instance.mesh = mesh
	mesh_instance.position = Vector3(0, 0.4, 0)
	
	# Material from NFT colors
	var material = StandardMaterial3D.new()
	material.albedo_color = _extract_dominant_color(fren.texture_2d)
	mesh_instance.material_override = material
	
	return mesh_instance

func _generate_head_mesh(fren: FrenData) -> MeshInstance3D:
	var mesh_instance = MeshInstance3D.new()
	mesh_instance.name = "Head"
	
	var sphere = SphereMesh.new()
	sphere.radius = 0.3
	mesh_instance.mesh = sphere
	mesh_instance.position = Vector3(0, 1.1, 0)
	
	# Project NFT onto head
	var material = StandardMaterial3D.new()
	material.albedo_texture = fren.texture_2d
	material.uv1_scale = Vector3(1, 1, 1)
	mesh_instance.material_override = material
	
	return mesh_instance

func _generate_arm_mesh(fren: FrenData, is_left: bool) -> MeshInstance3D:
	var mesh_instance = MeshInstance3D.new()
	mesh_instance.name = "LeftArm" if is_left else "RightArm"
	
	var capsule = CapsuleMesh.new()
	capsule.radius = 0.08
	capsule.height = 0.5
	mesh_instance.mesh = capsule
	
	var x_offset = -0.4 if is_left else 0.4
	mesh_instance.position = Vector3(x_offset, 0.6, 0)
	mesh_instance.rotation_degrees = Vector3(0, 0, 15 if is_left else -15)
	
	var material = StandardMaterial3D.new()
	material.albedo_color = _extract_secondary_color(fren.texture_2d)
	mesh_instance.material_override = material
	
	return mesh_instance

func _generate_leg_mesh(fren: FrenData, is_left: bool) -> MeshInstance3D:
	var mesh_instance = MeshInstance3D.new()
	mesh_instance.name = "LeftLeg" if is_left else "RightLeg"
	
	var capsule = CapsuleMesh.new()
	capsule.radius = 0.1
	capsule.height = 0.6
	mesh_instance.mesh = capsule
	
	var x_offset = -0.15 if is_left else 0.15
	mesh_instance.position = Vector3(x_offset, -0.2, 0)
	
	var material = StandardMaterial3D.new()
	material.albedo_color = _extract_secondary_color(fren.texture_2d)
	mesh_instance.material_override = material
	
	return mesh_instance

func _create_shadow() -> MeshInstance3D:
	var shadow = MeshInstance3D.new()
	shadow.name = "Shadow"
	
	var quad = QuadMesh.new()
	quad.size = Vector2(0.8, 0.8)
	shadow.mesh = quad
	shadow.rotation_degrees = Vector3(-90, 0, 0)
	shadow.position = Vector3(0, 0.01, 0)
	
	var material = StandardMaterial3D.new()
	material.albedo_color = Color(0, 0, 0, 0.3)
	material.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	shadow.material_override = material
	
	return shadow

func _add_trait_accessories(root: Node3D, fren: FrenData):
	# Add accessories based on NFT traits
	if fren.traits.has("hat") or fren.traits.has("headwear"):
		var hat = _create_hat(fren.traits.get("hat", fren.traits.get("headwear", "basic")))
		hat.position = Vector3(0, 1.4, 0)
		root.add_child(hat)
	
	if fren.traits.has("accessory"):
		var accessory = _create_accessory(fren.traits.accessory)
		root.add_child(accessory)

func _create_hat(hat_type: String) -> MeshInstance3D:
	var hat = MeshInstance3D.new()
	hat.name = "Hat"
	
	var cone = CylinderMesh.new()
	cone.top_radius = 0.0
	cone.bottom_radius = 0.25
	cone.height = 0.3
	hat.mesh = cone
	
	return hat

func _create_accessory(accessory_type: String) -> Node3D:
	var accessory = Node3D.new()
	accessory.name = "Accessory_" + accessory_type
	# Add accessory mesh based on type
	return accessory

# ============================================================================
# ANIMATION HELPERS
# ============================================================================

func _setup_skeleton(skeleton: Skeleton3D):
	# Root bone
	skeleton.add_bone("Root")
	skeleton.set_bone_rest(0, Transform3D.IDENTITY)
	
	# Spine
	skeleton.add_bone("Spine")
	skeleton.set_bone_parent(1, 0)
	
	# Head
	skeleton.add_bone("Head")
	skeleton.set_bone_parent(2, 1)
	
	# Arms
	skeleton.add_bone("LeftArm")
	skeleton.set_bone_parent(3, 1)
	skeleton.add_bone("RightArm")
	skeleton.set_bone_parent(4, 1)
	
	# Legs
	skeleton.add_bone("LeftLeg")
	skeleton.set_bone_parent(5, 0)
	skeleton.add_bone("RightLeg")
	skeleton.set_bone_parent(6, 0)

func _create_idle_animation(anim_player: AnimationPlayer):
	var anim = Animation.new()
	anim.length = 2.0
	anim.loop_mode = Animation.LOOP_LINEAR
	
	# Subtle breathing motion
	var track_idx = anim.add_track(Animation.TYPE_POSITION_3D)
	anim.track_set_path(track_idx, "Skeleton:Spine")
	anim.track_insert_key(track_idx, 0.0, Vector3(0, 0, 0))
	anim.track_insert_key(track_idx, 1.0, Vector3(0, 0.02, 0))
	anim.track_insert_key(track_idx, 2.0, Vector3(0, 0, 0))
	
	var lib = AnimationLibrary.new()
	lib.add_animation("idle", anim)
	anim_player.add_animation_library("", lib)

func _create_walk_animation(anim_player: AnimationPlayer):
	var anim = Animation.new()
	anim.length = 1.0
	anim.loop_mode = Animation.LOOP_LINEAR
	
	# Leg movement
	# ... animation keyframes
	
	var lib = anim_player.get_animation_library("")
	if lib:
		lib.add_animation("walk", anim)

func _create_interact_animation(anim_player: AnimationPlayer):
	var anim = Animation.new()
	anim.length = 0.5
	
	# Arm reaching motion
	# ... animation keyframes
	
	var lib = anim_player.get_animation_library("")
	if lib:
		lib.add_animation("interact", anim)

# ============================================================================
# PARTICLE EFFECTS
# ============================================================================

func _create_aura_particles(fren: FrenData) -> GPUParticles3D:
	var particles = GPUParticles3D.new()
	particles.name = "Aura"
	particles.amount = 50
	particles.lifetime = 2.0
	
	var material = ParticleProcessMaterial.new()
	material.emission_shape = ParticleProcessMaterial.EMISSION_SHAPE_SPHERE
	material.emission_sphere_radius = 0.5
	material.direction = Vector3(0, 1, 0)
	material.spread = 30.0
	material.initial_velocity_min = 0.2
	material.initial_velocity_max = 0.5
	material.gravity = Vector3(0, 0.1, 0)
	material.scale_min = 0.05
	material.scale_max = 0.1
	
	# Color based on evolution level and activity
	var color = _get_aura_color(fren)
	material.color = color
	
	particles.process_material = material
	particles.position = Vector3(0, 0.5, 0)
	
	return particles

func _get_aura_color(fren: FrenData) -> Color:
	# Color based on dominant activity type
	var activity_counts = {}
	
	if _activity_cache.has(fren.address):
		for activity in _activity_cache[fren.address]:
			var type = activity.type
			activity_counts[type] = activity_counts.get(type, 0) + 1
	
	# Find dominant activity
	var dominant = "transaction_sent"
	var max_count = 0
	for type in activity_counts:
		if activity_counts[type] > max_count:
			max_count = activity_counts[type]
			dominant = type
	
	# Map activity to color
	match dominant:
		"defi_swap", "defi_supply":
			return Color(0.2, 0.8, 0.4, 0.8)  # Green (DeFi)
		"cross_chain_bridge":
			return Color(0.8, 0.4, 0.9, 0.8)  # Purple (Bridge)
		"nft_mint", "nft_trade":
			return Color(0.9, 0.6, 0.2, 0.8)  # Orange (NFT)
		"glyph_execution":
			return Color(0.9, 0.9, 0.3, 0.8)  # Gold (Glyph)
		"contract_deployed":
			return Color(0.3, 0.6, 0.9, 0.8)  # Blue (Builder)
		_:
			return Color(0.5, 0.5, 0.5, 0.8)  # Gray (Default)

func _add_special_effects(root: Node3D, fren: FrenData):
	# Add effects based on achievements
	var total_activities = _activity_cache.get(fren.address, []).size()
	
	if total_activities > 1000:
		# Legendary ring
		var ring = _create_legendary_ring()
		root.add_child(ring)
	
	if fren.traits.has("rare") or fren.traits.has("legendary"):
		# Sparkle effect
		var sparkles = _create_sparkle_effect()
		root.add_child(sparkles)

func _create_legendary_ring() -> MeshInstance3D:
	var ring = MeshInstance3D.new()
	ring.name = "LegendaryRing"
	
	var torus = TorusMesh.new()
	torus.inner_radius = 0.4
	torus.outer_radius = 0.5
	ring.mesh = torus
	ring.position = Vector3(0, 0.5, 0)
	ring.rotation_degrees = Vector3(90, 0, 0)
	
	var material = StandardMaterial3D.new()
	material.albedo_color = Color(1.0, 0.85, 0.0, 0.6)
	material.emission_enabled = true
	material.emission = Color(1.0, 0.85, 0.0)
	material.emission_energy_multiplier = 2.0
	material.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	ring.material_override = material
	
	return ring

func _create_sparkle_effect() -> GPUParticles3D:
	var particles = GPUParticles3D.new()
	particles.name = "Sparkles"
	particles.amount = 20
	particles.lifetime = 1.5
	
	var material = ParticleProcessMaterial.new()
	material.emission_shape = ParticleProcessMaterial.EMISSION_SHAPE_BOX
	material.emission_box_extents = Vector3(0.5, 1.0, 0.5)
	material.gravity = Vector3.ZERO
	material.scale_min = 0.02
	material.scale_max = 0.05
	material.color = Color(1, 1, 0.8, 1)
	
	particles.process_material = material
	particles.position = Vector3(0, 0.5, 0)
	
	return particles

func _create_emote_controller(fren: FrenData) -> Node:
	var controller = Node.new()
	controller.name = "EmoteController"
	controller.set_meta("available_emotes", ["wave", "dance", "celebrate", "thinking"])
	return controller

# ============================================================================
# COLOR EXTRACTION
# ============================================================================

func _extract_dominant_color(texture: Texture2D) -> Color:
	if not texture:
		return Color(0.5, 0.5, 0.5)
	
	var image = texture.get_image()
	if not image:
		return Color(0.5, 0.5, 0.5)
	
	# Sample center pixels
	var width = image.get_width()
	var height = image.get_height()
	var center_x = width / 2
	var center_y = height / 2
	
	var total_color = Color(0, 0, 0)
	var samples = 0
	
	for dx in range(-5, 6):
		for dy in range(-5, 6):
			var x = clampi(center_x + dx, 0, width - 1)
			var y = clampi(center_y + dy, 0, height - 1)
			total_color += image.get_pixel(x, y)
			samples += 1
	
	return total_color / samples

func _extract_secondary_color(texture: Texture2D) -> Color:
	if not texture:
		return Color(0.4, 0.4, 0.4)
	
	var image = texture.get_image()
	if not image:
		return Color(0.4, 0.4, 0.4)
	
	# Sample edge pixels for secondary color
	var width = image.get_width()
	var height = image.get_height()
	
	var total_color = Color(0, 0, 0)
	var samples = 0
	
	# Sample corners
	for x in [0, width - 1]:
		for y in [0, height - 1]:
			total_color += image.get_pixel(x, y)
			samples += 1
	
	return total_color / samples

# ============================================================================
# BASE MESH GENERATORS (for higher levels)
# ============================================================================

func _create_detailed_mesh_base(fren: FrenData) -> Node3D:
	# Same as _create_detailed_mesh but returns before emitting signal
	var root = Node3D.new()
	root.name = "Fren_" + fren.address.substr(0, 8)
	
	var body = _generate_body_mesh(fren)
	root.add_child(body)
	
	var head = _generate_head_mesh(fren)
	root.add_child(head)
	
	var left_arm = _generate_arm_mesh(fren, true)
	var right_arm = _generate_arm_mesh(fren, false)
	root.add_child(left_arm)
	root.add_child(right_arm)
	
	var left_leg = _generate_leg_mesh(fren, true)
	var right_leg = _generate_leg_mesh(fren, false)
	root.add_child(left_leg)
	root.add_child(right_leg)
	
	if fren.unlocked_features.has("accessories_slot"):
		_add_trait_accessories(root, fren)
	
	var shadow = _create_shadow()
	root.add_child(shadow)
	
	return root

func _create_animated_mesh_base(fren: FrenData) -> Node3D:
	var root = _create_detailed_mesh_base(fren)
	
	var skeleton = Skeleton3D.new()
	skeleton.name = "Skeleton"
	_setup_skeleton(skeleton)
	
	var anim_player = AnimationPlayer.new()
	anim_player.name = "AnimationPlayer"
	
	if fren.unlocked_features.has("idle_animation"):
		_create_idle_animation(anim_player)
	if fren.unlocked_features.has("walk_animation"):
		_create_walk_animation(anim_player)
	if fren.unlocked_features.has("interact_animation"):
		_create_interact_animation(anim_player)
	
	root.add_child(skeleton)
	root.add_child(anim_player)
	
	return root

# ============================================================================
# PUBLIC API
# ============================================================================

func get_fren(address: String) -> FrenData:
	return _frens.get(address.to_lower())

func get_all_frens() -> Array:
	return _frens.values()

func get_fren_model(address: String) -> Node3D:
	var fren = get_fren(address)
	if fren:
		return fren.model_3d
	return null

func get_evolution_level(address: String) -> int:
	var fren = get_fren(address)
	if fren:
		return fren.evolution_level
	return -1

func get_activity_points(address: String) -> int:
	var fren = get_fren(address)
	if fren:
		return fren.activity_points
	return 0

func simulate_activity_burst(address: String, activity_type: String, count: int):
	# For testing - simulate multiple activities
	for i in range(count):
		record_activity(address, activity_type)
