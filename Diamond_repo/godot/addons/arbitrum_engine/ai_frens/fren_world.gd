# FrenWorld - 3D World where AI Frens traverse and interact on Arbitrum
#
# Features:
# - 3D environment representing Arbitrum network
# - AI Frens walking around, interacting with DeFi "buildings"
# - Visual representation of transactions as paths/bridges
# - Real-time activity reflected in the world

extends Node3D

class_name FrenWorld

# ============================================================================
# SIGNALS
# ============================================================================

signal fren_entered_zone(fren_address: String, zone_name: String)
signal fren_interacted(fren_address: String, target: String)
signal world_transaction(from: String, to: String, amount: float)

# ============================================================================
# EXPORTS
# ============================================================================

@export var fren_evolution: FrenEvolution
@export var arbitrum_engine: ArbitrumEngine

@export_group("World Settings")
@export var world_size: Vector3 = Vector3(100, 20, 100)
@export var spawn_point: Vector3 = Vector3(0, 1, 0)
@export var enable_day_night: bool = true

@export_group("Zones")
@export var defi_district_position: Vector3 = Vector3(20, 0, 0)
@export var nft_gallery_position: Vector3 = Vector3(-20, 0, 0)
@export var bridge_tower_position: Vector3 = Vector3(0, 0, 30)
@export var guild_hall_position: Vector3 = Vector3(0, 0, -30)

# ============================================================================
# WORLD STRUCTURES
# ============================================================================

# Zone definitions for the Arbitrum world
const ZONES = {
	"SPAWN": {
		"position": Vector3(0, 0, 0),
		"radius": 10.0,
		"type": "spawn"
	},
	"UNISWAP_TOWER": {
		"position": Vector3(25, 0, 10),
		"radius": 8.0,
		"type": "defi",
		"glyph": 0  # Aleph - uniswapSwap
	},
	"AAVE_BANK": {
		"position": Vector3(25, 0, -10),
		"radius": 8.0,
		"type": "defi",
		"glyph": 1  # Beth - aaveSupply
	},
	"GMX_EXCHANGE": {
		"position": Vector3(35, 0, 0),
		"radius": 8.0,
		"type": "defi",
		"glyph": 3  # Daleth - gmxSwap
	},
	"ORACLE_SHRINE": {
		"position": Vector3(-15, 0, 20),
		"radius": 6.0,
		"type": "oracle",
		"glyph": 4  # He - getETHPrice
	},
	"NFT_GALLERY": {
		"position": Vector3(-25, 0, 0),
		"radius": 12.0,
		"type": "nft",
		"glyph": 9  # Yodh - buyTreasureNFT
	},
	"MAGICSWAP_VAULT": {
		"position": Vector3(-30, 0, 15),
		"radius": 8.0,
		"type": "nft",
		"glyph": 17  # Tsade - swapNFTsForTokens
	},
	"COSMOS_BRIDGE": {
		"position": Vector3(0, 0, 40),
		"radius": 10.0,
		"type": "bridge",
		"glyph": 12,  # Mem - bridgeToCosmos
		"destination": "COSMOS"
	},
	"ENJIN_PORTAL": {
		"position": Vector3(20, 0, 35),
		"radius": 8.0,
		"type": "bridge",
		"glyph": 13,  # Nun - bridgeToEnjin
		"destination": "ENJIN"
	},
	"TON_GATEWAY": {
		"position": Vector3(-20, 0, 35),
		"radius": 8.0,
		"type": "bridge",
		"glyph": 14,  # Samekh - bridgeToTon
		"destination": "TON"
	},
	"GUILD_HALL": {
		"position": Vector3(0, 0, -35),
		"radius": 15.0,
		"type": "social",
		"glyph": 18  # Qoph - createGuild
	},
	"CRAFTING_FORGE": {
		"position": Vector3(-15, 0, -25),
		"radius": 8.0,
		"type": "crafting",
		"glyph": 19  # Resh - craft
	},
	"STAR_NEXUS": {
		"position": Vector3(0, 5, 0),
		"radius": 5.0,
		"type": "special",
		"glyph": 21  # Tav - executeStarRoute
	}
}

# ============================================================================
# STATE
# ============================================================================

var _fren_instances: Dictionary = {}  # address -> Node3D instance in world
var _fren_positions: Dictionary = {}  # address -> Vector3
var _fren_targets: Dictionary = {}    # address -> Vector3 (movement target)
var _zone_nodes: Dictionary = {}      # zone_name -> Node3D
var _transaction_trails: Array = []

var _camera: Camera3D
var _environment: WorldEnvironment
var _sun: DirectionalLight3D
var _day_time: float = 0.5  # 0-1 representing time of day

# ============================================================================
# INITIALIZATION
# ============================================================================

func _ready():
	_setup_world()
	_setup_camera()
	_setup_lighting()
	_setup_zones()
	
	if fren_evolution:
		fren_evolution.fren_3d_ready.connect(_on_fren_3d_ready)
		fren_evolution.fren_evolved.connect(_on_fren_evolved)
		fren_evolution.fren_activity_recorded.connect(_on_fren_activity)

func _setup_world():
	# Ground plane
	var ground = MeshInstance3D.new()
	ground.name = "Ground"
	
	var plane = PlaneMesh.new()
	plane.size = Vector2(world_size.x, world_size.z)
	ground.mesh = plane
	
	var ground_material = StandardMaterial3D.new()
	ground_material.albedo_color = Color(0.15, 0.2, 0.35)  # Arbitrum blue-ish
	ground_material.metallic = 0.1
	ground_material.roughness = 0.8
	ground.material_override = ground_material
	
	add_child(ground)
	
	# Grid overlay (representing blockchain)
	var grid = _create_grid_overlay()
	add_child(grid)

func _create_grid_overlay() -> Node3D:
	var grid_parent = Node3D.new()
	grid_parent.name = "BlockchainGrid"
	
	var line_material = StandardMaterial3D.new()
	line_material.albedo_color = Color(0.2, 0.4, 0.8, 0.3)
	line_material.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	line_material.emission_enabled = true
	line_material.emission = Color(0.2, 0.4, 0.8)
	line_material.emission_energy_multiplier = 0.5
	
	# Create grid lines every 10 units
	var grid_spacing = 10.0
	var half_size = world_size.x / 2
	
	for i in range(-int(half_size / grid_spacing), int(half_size / grid_spacing) + 1):
		var x = i * grid_spacing
		
		# X-axis lines
		var line_x = _create_line(Vector3(x, 0.02, -half_size), Vector3(x, 0.02, half_size), line_material)
		grid_parent.add_child(line_x)
		
		# Z-axis lines
		var line_z = _create_line(Vector3(-half_size, 0.02, x), Vector3(half_size, 0.02, x), line_material)
		grid_parent.add_child(line_z)
	
	return grid_parent

func _create_line(from: Vector3, to: Vector3, material: StandardMaterial3D) -> MeshInstance3D:
	var mesh_instance = MeshInstance3D.new()
	
	var immediate_mesh = ImmediateMesh.new()
	immediate_mesh.surface_begin(Mesh.PRIMITIVE_LINES, material)
	immediate_mesh.surface_add_vertex(from)
	immediate_mesh.surface_add_vertex(to)
	immediate_mesh.surface_end()
	
	mesh_instance.mesh = immediate_mesh
	return mesh_instance

func _setup_camera():
	_camera = Camera3D.new()
	_camera.name = "WorldCamera"
	_camera.position = Vector3(0, 40, 50)
	_camera.rotation_degrees = Vector3(-35, 0, 0)
	add_child(_camera)

func _setup_lighting():
	# Environment
	_environment = WorldEnvironment.new()
	var env = Environment.new()
	env.background_mode = Environment.BG_COLOR
	env.background_color = Color(0.05, 0.08, 0.15)
	env.ambient_light_color = Color(0.2, 0.3, 0.5)
	env.ambient_light_energy = 0.3
	env.fog_enabled = true
	env.fog_light_color = Color(0.1, 0.15, 0.25)
	env.fog_density = 0.005
	_environment.environment = env
	add_child(_environment)
	
	# Sun
	_sun = DirectionalLight3D.new()
	_sun.name = "Sun"
	_sun.rotation_degrees = Vector3(-45, 30, 0)
	_sun.light_color = Color(1.0, 0.95, 0.8)
	_sun.light_energy = 1.0
	_sun.shadow_enabled = true
	add_child(_sun)

func _setup_zones():
	for zone_name in ZONES.keys():
		var zone_data = ZONES[zone_name]
		var zone_node = _create_zone_structure(zone_name, zone_data)
		_zone_nodes[zone_name] = zone_node
		add_child(zone_node)

func _create_zone_structure(zone_name: String, zone_data: Dictionary) -> Node3D:
	var zone = Node3D.new()
	zone.name = zone_name
	zone.position = zone_data.position
	
	match zone_data.type:
		"defi":
			_add_defi_structure(zone, zone_name, zone_data)
		"oracle":
			_add_oracle_structure(zone, zone_name)
		"nft":
			_add_nft_structure(zone, zone_name, zone_data)
		"bridge":
			_add_bridge_structure(zone, zone_name, zone_data)
		"social":
			_add_social_structure(zone, zone_name)
		"crafting":
			_add_crafting_structure(zone, zone_name)
		"special":
			_add_special_structure(zone, zone_name)
		"spawn":
			_add_spawn_structure(zone)
	
	# Add zone indicator ring
	var indicator = _create_zone_indicator(zone_data.radius, zone_data.type)
	zone.add_child(indicator)
	
	# Add floating label
	var label = _create_floating_label(zone_name.replace("_", " "))
	label.position = Vector3(0, 8, 0)
	zone.add_child(label)
	
	return zone

func _add_defi_structure(zone: Node3D, name: String, data: Dictionary):
	# Tower structure
	var tower = MeshInstance3D.new()
	tower.name = "Tower"
	
	var cylinder = CylinderMesh.new()
	cylinder.top_radius = 2.0
	cylinder.bottom_radius = 3.0
	cylinder.height = 12.0
	tower.mesh = cylinder
	tower.position = Vector3(0, 6, 0)
	
	var material = StandardMaterial3D.new()
	material.albedo_color = Color(0.2, 0.8, 0.4)  # Green for DeFi
	material.emission_enabled = true
	material.emission = Color(0.1, 0.4, 0.2)
	tower.material_override = material
	
	zone.add_child(tower)
	
	# Rotating rings
	var ring = _create_rotating_ring(3.5, Color(0.3, 0.9, 0.5, 0.5))
	ring.position = Vector3(0, 10, 0)
	zone.add_child(ring)

func _add_oracle_structure(zone: Node3D, name: String):
	# Crystal shrine
	var crystal = MeshInstance3D.new()
	crystal.name = "Crystal"
	
	var prism = PrismMesh.new()
	prism.size = Vector3(3, 6, 3)
	crystal.mesh = prism
	crystal.position = Vector3(0, 3, 0)
	crystal.rotation_degrees = Vector3(0, 45, 0)
	
	var material = StandardMaterial3D.new()
	material.albedo_color = Color(0.6, 0.3, 0.9, 0.8)
	material.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	material.emission_enabled = true
	material.emission = Color(0.4, 0.2, 0.6)
	material.emission_energy_multiplier = 2.0
	crystal.material_override = material
	
	zone.add_child(crystal)

func _add_nft_structure(zone: Node3D, name: String, data: Dictionary):
	# Gallery cube
	var gallery = MeshInstance3D.new()
	gallery.name = "Gallery"
	
	var box = BoxMesh.new()
	box.size = Vector3(10, 6, 10)
	gallery.mesh = box
	gallery.position = Vector3(0, 3, 0)
	
	var material = StandardMaterial3D.new()
	material.albedo_color = Color(0.9, 0.5, 0.2)  # Orange for NFT
	material.metallic = 0.3
	gallery.material_override = material
	
	zone.add_child(gallery)
	
	# Picture frames on walls (placeholder)
	for i in range(4):
		var frame = _create_nft_frame()
		var angle = i * PI / 2
		frame.position = Vector3(cos(angle) * 5.5, 3, sin(angle) * 5.5)
		frame.rotation.y = angle + PI
		zone.add_child(frame)

func _create_nft_frame() -> MeshInstance3D:
	var frame = MeshInstance3D.new()
	frame.name = "NFTFrame"
	
	var quad = QuadMesh.new()
	quad.size = Vector2(3, 3)
	frame.mesh = quad
	
	var material = StandardMaterial3D.new()
	material.albedo_color = Color(0.8, 0.7, 0.5)
	frame.material_override = material
	
	return frame

func _add_bridge_structure(zone: Node3D, name: String, data: Dictionary):
	# Portal arch
	var portal = MeshInstance3D.new()
	portal.name = "Portal"
	
	var torus = TorusMesh.new()
	torus.inner_radius = 3.0
	torus.outer_radius = 4.0
	portal.mesh = torus
	portal.position = Vector3(0, 5, 0)
	portal.rotation_degrees = Vector3(0, 0, 0)
	
	# Color based on destination chain
	var color = _get_chain_color(data.get("destination", ""))
	var material = StandardMaterial3D.new()
	material.albedo_color = color
	material.emission_enabled = true
	material.emission = color
	material.emission_energy_multiplier = 1.5
	portal.material_override = material
	
	zone.add_child(portal)
	
	# Swirling particles inside portal
	var particles = _create_portal_particles(color)
	particles.position = Vector3(0, 5, 0)
	zone.add_child(particles)

func _get_chain_color(chain: String) -> Color:
	match chain:
		"COSMOS": return Color(0.3, 0.2, 0.5)
		"ENJIN": return Color(0.5, 0.0, 0.8)
		"TON": return Color(0.0, 0.7, 1.0)
		_: return Color(0.5, 0.5, 0.8)

func _create_portal_particles(color: Color) -> GPUParticles3D:
	var particles = GPUParticles3D.new()
	particles.name = "PortalParticles"
	particles.amount = 100
	particles.lifetime = 2.0
	
	var material = ParticleProcessMaterial.new()
	material.emission_shape = ParticleProcessMaterial.EMISSION_SHAPE_RING
	material.emission_ring_axis = Vector3(0, 0, 1)
	material.emission_ring_height = 0.5
	material.emission_ring_radius = 2.5
	material.emission_ring_inner_radius = 2.0
	material.direction = Vector3(0, 0, -1)
	material.initial_velocity_min = 1.0
	material.initial_velocity_max = 2.0
	material.angular_velocity_min = -180
	material.angular_velocity_max = 180
	material.scale_min = 0.1
	material.scale_max = 0.2
	material.color = color
	
	particles.process_material = material
	particles.rotation_degrees = Vector3(90, 0, 0)
	
	return particles

func _add_social_structure(zone: Node3D, name: String):
	# Grand hall
	var hall = MeshInstance3D.new()
	hall.name = "GuildHall"
	
	var box = BoxMesh.new()
	box.size = Vector3(15, 8, 20)
	hall.mesh = box
	hall.position = Vector3(0, 4, 0)
	
	var material = StandardMaterial3D.new()
	material.albedo_color = Color(0.7, 0.5, 0.2)  # Gold
	material.metallic = 0.5
	hall.material_override = material
	
	zone.add_child(hall)
	
	# Pillars
	for x in [-6, 6]:
		for z in [-8, 8]:
			var pillar = _create_pillar()
			pillar.position = Vector3(x, 4, z)
			zone.add_child(pillar)

func _create_pillar() -> MeshInstance3D:
	var pillar = MeshInstance3D.new()
	pillar.name = "Pillar"
	
	var cylinder = CylinderMesh.new()
	cylinder.top_radius = 0.5
	cylinder.bottom_radius = 0.6
	cylinder.height = 8.0
	pillar.mesh = cylinder
	
	var material = StandardMaterial3D.new()
	material.albedo_color = Color(0.8, 0.75, 0.6)
	pillar.material_override = material
	
	return pillar

func _add_crafting_structure(zone: Node3D, name: String):
	# Forge structure
	var forge = MeshInstance3D.new()
	forge.name = "Forge"
	
	var cylinder = CylinderMesh.new()
	cylinder.top_radius = 2.5
	cylinder.bottom_radius = 3.5
	cylinder.height = 5.0
	forge.mesh = cylinder
	forge.position = Vector3(0, 2.5, 0)
	
	var material = StandardMaterial3D.new()
	material.albedo_color = Color(0.3, 0.25, 0.2)
	forge.material_override = material
	
	zone.add_child(forge)
	
	# Fire particles
	var fire = _create_fire_particles()
	fire.position = Vector3(0, 4, 0)
	zone.add_child(fire)

func _create_fire_particles() -> GPUParticles3D:
	var particles = GPUParticles3D.new()
	particles.name = "Fire"
	particles.amount = 50
	particles.lifetime = 1.0
	
	var material = ParticleProcessMaterial.new()
	material.emission_shape = ParticleProcessMaterial.EMISSION_SHAPE_SPHERE
	material.emission_sphere_radius = 1.0
	material.direction = Vector3(0, 1, 0)
	material.spread = 15.0
	material.initial_velocity_min = 2.0
	material.initial_velocity_max = 4.0
	material.gravity = Vector3(0, 2, 0)
	material.scale_min = 0.2
	material.scale_max = 0.5
	material.color = Color(1.0, 0.5, 0.1)
	
	particles.process_material = material
	
	return particles

func _add_special_structure(zone: Node3D, name: String):
	# Star Nexus - floating central hub
	var nexus = MeshInstance3D.new()
	nexus.name = "StarNexus"
	
	var sphere = SphereMesh.new()
	sphere.radius = 2.0
	nexus.mesh = sphere
	
	var material = StandardMaterial3D.new()
	material.albedo_color = Color(1.0, 0.9, 0.5, 0.8)
	material.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	material.emission_enabled = true
	material.emission = Color(1.0, 0.85, 0.3)
	material.emission_energy_multiplier = 3.0
	nexus.material_override = material
	
	zone.add_child(nexus)
	
	# Orbiting stars (13-point representation)
	for i in range(12):
		var star = _create_orbiting_star(i)
		zone.add_child(star)

func _create_orbiting_star(index: int) -> Node3D:
	var orbit = Node3D.new()
	orbit.name = "Orbit_" + str(index)
	
	var star = MeshInstance3D.new()
	star.name = "Star"
	
	var sphere = SphereMesh.new()
	sphere.radius = 0.3
	star.mesh = sphere
	
	var angle = index * (TAU / 12)
	star.position = Vector3(cos(angle) * 4, sin(angle * 0.5), sin(angle) * 4)
	
	var material = StandardMaterial3D.new()
	material.albedo_color = Color.from_hsv(float(index) / 12.0, 0.8, 1.0)
	material.emission_enabled = true
	material.emission = Color.from_hsv(float(index) / 12.0, 0.8, 1.0)
	star.material_override = material
	
	orbit.add_child(star)
	orbit.set_meta("orbit_speed", 0.5 + randf() * 0.5)
	
	return orbit

func _add_spawn_structure(zone: Node3D):
	# Simple spawn platform
	var platform = MeshInstance3D.new()
	platform.name = "SpawnPlatform"
	
	var cylinder = CylinderMesh.new()
	cylinder.top_radius = 5.0
	cylinder.bottom_radius = 5.0
	cylinder.height = 0.5
	platform.mesh = cylinder
	platform.position = Vector3(0, 0.25, 0)
	
	var material = StandardMaterial3D.new()
	material.albedo_color = Color(0.3, 0.4, 0.6)
	material.emission_enabled = true
	material.emission = Color(0.2, 0.3, 0.5)
	platform.material_override = material
	
	zone.add_child(platform)

func _create_zone_indicator(radius: float, type: String) -> MeshInstance3D:
	var indicator = MeshInstance3D.new()
	indicator.name = "ZoneIndicator"
	
	var torus = TorusMesh.new()
	torus.inner_radius = radius - 0.2
	torus.outer_radius = radius
	indicator.mesh = torus
	indicator.rotation_degrees = Vector3(90, 0, 0)
	indicator.position = Vector3(0, 0.1, 0)
	
	var color = _get_zone_color(type)
	var material = StandardMaterial3D.new()
	material.albedo_color = Color(color.r, color.g, color.b, 0.3)
	material.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	material.emission_enabled = true
	material.emission = color
	material.emission_energy_multiplier = 0.5
	indicator.material_override = material
	
	return indicator

func _get_zone_color(type: String) -> Color:
	match type:
		"defi": return Color(0.2, 0.8, 0.4)
		"oracle": return Color(0.6, 0.3, 0.9)
		"nft": return Color(0.9, 0.5, 0.2)
		"bridge": return Color(0.3, 0.6, 0.9)
		"social": return Color(0.9, 0.7, 0.2)
		"crafting": return Color(0.9, 0.3, 0.2)
		"special": return Color(1.0, 0.9, 0.4)
		_: return Color(0.5, 0.5, 0.5)

func _create_floating_label(text: String) -> Node3D:
	var label_node = Node3D.new()
	label_node.name = "Label"
	
	var label = Label3D.new()
	label.text = text
	label.font_size = 48
	label.billboard = BaseMaterial3D.BILLBOARD_ENABLED
	label.modulate = Color(1, 1, 1, 0.9)
	label_node.add_child(label)
	
	return label_node

func _create_rotating_ring(radius: float, color: Color) -> Node3D:
	var ring_node = Node3D.new()
	ring_node.name = "RotatingRing"
	
	var ring = MeshInstance3D.new()
	var torus = TorusMesh.new()
	torus.inner_radius = radius - 0.3
	torus.outer_radius = radius
	ring.mesh = torus
	ring.rotation_degrees = Vector3(90, 0, 0)
	
	var material = StandardMaterial3D.new()
	material.albedo_color = color
	material.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	material.emission_enabled = true
	material.emission = Color(color.r, color.g, color.b)
	ring.material_override = material
	
	ring_node.add_child(ring)
	ring_node.set_meta("rotation_speed", 30.0)
	
	return ring_node

# ============================================================================
# FREN MANAGEMENT
# ============================================================================

func _on_fren_3d_ready(fren_address: String, model: Node3D):
	spawn_fren(fren_address, model)

func _on_fren_evolved(fren_address: String, new_level: int, model: Node3D):
	# Replace old model with new evolved one
	if _fren_instances.has(fren_address):
		var old_model = _fren_instances[fren_address]
		var position = old_model.position
		old_model.queue_free()
		
		model.position = position
		add_child(model)
		_fren_instances[fren_address] = model
		_fren_positions[fren_address] = position

func _on_fren_activity(fren_address: String, activity_type: String, points: int):
	# Visual feedback for activity
	if _fren_instances.has(fren_address):
		var model = _fren_instances[fren_address]
		_show_activity_effect(model, activity_type)

func spawn_fren(fren_address: String, model: Node3D):
	if _fren_instances.has(fren_address):
		return  # Already spawned
	
	model.position = spawn_point
	add_child(model)
	
	_fren_instances[fren_address] = model
	_fren_positions[fren_address] = spawn_point
	
	# Spawn animation
	var tween = create_tween()
	model.scale = Vector3.ZERO
	tween.tween_property(model, "scale", Vector3.ONE, 0.5).set_ease(Tween.EASE_OUT)

func remove_fren(fren_address: String):
	if not _fren_instances.has(fren_address):
		return
	
	var model = _fren_instances[fren_address]
	
	# Despawn animation
	var tween = create_tween()
	tween.tween_property(model, "scale", Vector3.ZERO, 0.3)
	tween.tween_callback(model.queue_free)
	
	_fren_instances.erase(fren_address)
	_fren_positions.erase(fren_address)
	_fren_targets.erase(fren_address)

func move_fren_to(fren_address: String, target: Vector3):
	if not _fren_instances.has(fren_address):
		return
	
	_fren_targets[fren_address] = target

func move_fren_to_zone(fren_address: String, zone_name: String):
	if not ZONES.has(zone_name):
		return
	
	var zone_pos = ZONES[zone_name].position
	var offset = Vector3(randf_range(-3, 3), 0, randf_range(-3, 3))
	move_fren_to(fren_address, zone_pos + offset)

func _show_activity_effect(model: Node3D, activity_type: String):
	# Create floating text
	var label = Label3D.new()
	label.text = "+" + activity_type.replace("_", " ")
	label.font_size = 24
	label.billboard = BaseMaterial3D.BILLBOARD_ENABLED
	label.position = model.position + Vector3(0, 2, 0)
	label.modulate = Color(1, 1, 0.5, 1)
	add_child(label)
	
	# Animate and remove
	var tween = create_tween()
	tween.tween_property(label, "position:y", label.position.y + 2, 1.0)
	tween.parallel().tween_property(label, "modulate:a", 0.0, 1.0)
	tween.tween_callback(label.queue_free)

# ============================================================================
# UPDATE LOOP
# ============================================================================

func _process(delta):
	_update_fren_movement(delta)
	_update_rotating_elements(delta)
	_update_zone_interactions()
	
	if enable_day_night:
		_update_day_night_cycle(delta)

func _update_fren_movement(delta):
	var move_speed = 5.0
	
	for fren_address in _fren_targets.keys():
		if not _fren_instances.has(fren_address):
			continue
		
		var model = _fren_instances[fren_address]
		var target = _fren_targets[fren_address]
		var current = model.position
		
		var direction = (target - current)
		direction.y = 0  # Keep on ground
		
		if direction.length() < 0.5:
			_fren_targets.erase(fren_address)
			continue
		
		direction = direction.normalized()
		model.position += direction * move_speed * delta
		_fren_positions[fren_address] = model.position
		
		# Rotate to face movement direction
		if direction.length() > 0.01:
			model.look_at(model.position + direction, Vector3.UP)

func _update_rotating_elements(delta):
	for zone_name in _zone_nodes.keys():
		var zone = _zone_nodes[zone_name]
		
		# Rotate rings
		for child in zone.get_children():
			if child.has_meta("rotation_speed"):
				child.rotation_degrees.y += child.get_meta("rotation_speed") * delta
			if child.has_meta("orbit_speed"):
				child.rotation_degrees.y += child.get_meta("orbit_speed") * delta * 30

func _update_zone_interactions():
	for fren_address in _fren_positions.keys():
		var pos = _fren_positions[fren_address]
		
		for zone_name in ZONES.keys():
			var zone = ZONES[zone_name]
			var distance = pos.distance_to(zone.position)
			
			if distance < zone.radius:
				fren_entered_zone.emit(fren_address, zone_name)
				
				# Could trigger zone-specific interactions
				# e.g., auto-execute glyph when in zone

func _update_day_night_cycle(delta):
	_day_time += delta * 0.01  # Very slow cycle
	if _day_time > 1.0:
		_day_time = 0.0
	
	# Update sun position
	var sun_angle = _day_time * 360 - 90
	_sun.rotation_degrees.x = sun_angle
	
	# Update lighting intensity
	var intensity = sin(_day_time * PI)
	_sun.light_energy = 0.3 + intensity * 0.7

# ============================================================================
# PUBLIC API
# ============================================================================

func get_fren_position(fren_address: String) -> Vector3:
	return _fren_positions.get(fren_address, Vector3.ZERO)

func get_zone_at_position(pos: Vector3) -> String:
	for zone_name in ZONES.keys():
		var zone = ZONES[zone_name]
		if pos.distance_to(zone.position) < zone.radius:
			return zone_name
	return ""

func get_all_frens_in_zone(zone_name: String) -> Array:
	var frens = []
	if not ZONES.has(zone_name):
		return frens
	
	var zone = ZONES[zone_name]
	for fren_address in _fren_positions.keys():
		if _fren_positions[fren_address].distance_to(zone.position) < zone.radius:
			frens.append(fren_address)
	
	return frens

func focus_camera_on_fren(fren_address: String):
	if not _fren_instances.has(fren_address):
		return
	
	var model = _fren_instances[fren_address]
	var target_pos = model.position + Vector3(0, 10, 15)
	
	var tween = create_tween()
	tween.tween_property(_camera, "position", target_pos, 1.0)

func focus_camera_on_zone(zone_name: String):
	if not ZONES.has(zone_name):
		return
	
	var zone_pos = ZONES[zone_name].position
	var target_pos = zone_pos + Vector3(0, 15, 20)
	
	var tween = create_tween()
	tween.tween_property(_camera, "position", target_pos, 1.0)
