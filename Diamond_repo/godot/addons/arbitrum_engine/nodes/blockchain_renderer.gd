# BlockchainRenderer - Visual rendering of Arbitrum blockchain state
#
# Use this node to create visual representations of:
# - Transaction flows
# - Block confirmations
# - Cross-chain routing (13-Point Star visualization)
# - NFT galleries
# - Glyph execution animations

extends Node2D

class_name BlockchainRenderer

# ============================================================================
# EXPORTS
# ============================================================================

@export var engine: ArbitrumEngine
@export var show_transactions: bool = true
@export var show_blocks: bool = true
@export var show_star_routes: bool = true
@export var animation_speed: float = 1.0

# Visual settings
@export_group("Colors")
@export var pending_tx_color: Color = Color(1.0, 0.8, 0.0, 0.8)  # Yellow
@export var confirmed_tx_color: Color = Color(0.0, 1.0, 0.5, 0.8)  # Green
@export var failed_tx_color: Color = Color(1.0, 0.2, 0.2, 0.8)  # Red
@export var block_color: Color = Color(0.3, 0.5, 1.0, 0.6)  # Blue

@export_group("Star Visualization")
@export var star_center: Vector2 = Vector2(500, 400)
@export var star_radius: float = 300.0
@export var chain_node_radius: float = 40.0

# ============================================================================
# INTERNAL STATE
# ============================================================================

var _transaction_visuals: Dictionary = {}
var _block_visuals: Array = []
var _star_nodes: Dictionary = {}
var _active_routes: Array = []

# Preloaded scenes
var _tx_visual_scene: PackedScene
var _block_visual_scene: PackedScene
var _glyph_effect_scene: PackedScene

# ============================================================================
# STAR POSITIONS (13-Point Star Layout)
# ============================================================================

const STAR_POSITIONS = {
	"ARBITRUM": 0,      # Center/Apex
	"ETHEREUM": 1,
	"POLYGON": 2,
	"BASE": 3,
	"COINWEB": 4,
	"COSMOS": 5,
	"TON": 6,
	"GNOSIS": 7,
	"ENJIN": 8,
	"OPTIMISM": 9,
	"AVALANCHE": 10,
	"BSC": 11,
	"FANTOM": 12
}

const CHAIN_COLORS = {
	"ARBITRUM": Color(0.16, 0.46, 0.96),   # Blue
	"ETHEREUM": Color(0.4, 0.4, 0.5),       # Gray
	"POLYGON": Color(0.5, 0.2, 0.9),        # Purple
	"BASE": Color(0.0, 0.3, 0.9),           # Dark Blue
	"COINWEB": Color(0.9, 0.5, 0.0),        # Orange
	"COSMOS": Color(0.2, 0.2, 0.4),         # Dark
	"TON": Color(0.0, 0.6, 0.9),            # Cyan
	"GNOSIS": Color(0.0, 0.6, 0.4),         # Teal
	"ENJIN": Color(0.4, 0.0, 0.8),          # Deep Purple
	"OPTIMISM": Color(1.0, 0.1, 0.2),       # Red
	"AVALANCHE": Color(0.9, 0.2, 0.3),      # Red
	"BSC": Color(0.95, 0.75, 0.0),          # Gold
	"FANTOM": Color(0.1, 0.5, 0.9)          # Blue
}

# ============================================================================
# INITIALIZATION
# ============================================================================

func _ready():
	if engine:
		_connect_engine_signals()
	
	_initialize_star_visualization()

func _connect_engine_signals():
	engine.transaction_sent.connect(_on_transaction_sent)
	engine.transaction_confirmed.connect(_on_transaction_confirmed)
	engine.transaction_failed.connect(_on_transaction_failed)
	engine.block_received.connect(_on_block_received)
	engine.cross_chain_message_sent.connect(_on_cross_chain_sent)
	engine.glyph_executed.connect(_on_glyph_executed)
	engine.nft_loaded.connect(_on_nft_loaded)

func _initialize_star_visualization():
	if not show_star_routes:
		return
	
	# Create 13 chain nodes in a star pattern
	for chain_name in STAR_POSITIONS.keys():
		var pos_index = STAR_POSITIONS[chain_name]
		var position = _calculate_star_position(pos_index)
		
		var node = _create_chain_node(chain_name, position)
		_star_nodes[chain_name] = node
		add_child(node)

func _calculate_star_position(index: int) -> Vector2:
	if index == 0:  # Arbitrum is at center
		return star_center
	
	# Other chains in a circle
	var angle = (index - 1) * (TAU / 12) - PI/2  # Start from top
	var x = star_center.x + cos(angle) * star_radius
	var y = star_center.y + sin(angle) * star_radius
	return Vector2(x, y)

func _create_chain_node(chain_name: String, position: Vector2) -> Node2D:
	var node = Node2D.new()
	node.position = position
	node.name = chain_name + "_Node"
	
	# Circle background
	var circle = ColorRect.new()
	circle.size = Vector2(chain_node_radius * 2, chain_node_radius * 2)
	circle.position = -Vector2(chain_node_radius, chain_node_radius)
	circle.color = CHAIN_COLORS.get(chain_name, Color.WHITE)
	node.add_child(circle)
	
	# Label
	var label = Label.new()
	label.text = chain_name.substr(0, 3)
	label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	label.size = Vector2(chain_node_radius * 2, 20)
	label.position = Vector2(-chain_node_radius, -10)
	node.add_child(label)
	
	return node

# ============================================================================
# RENDERING
# ============================================================================

func _draw():
	if show_star_routes:
		_draw_star_connections()
		_draw_active_routes()

func _draw_star_connections():
	# Draw lines connecting all chains through Arbitrum hub
	var center = _star_nodes.get("ARBITRUM")
	if not center:
		return
	
	for chain_name in _star_nodes.keys():
		if chain_name == "ARBITRUM":
			continue
		
		var node = _star_nodes[chain_name]
		var color = CHAIN_COLORS.get(chain_name, Color.WHITE)
		color.a = 0.2
		draw_line(center.position, node.position, color, 2.0)

func _draw_active_routes():
	for route in _active_routes:
		var from_node = _star_nodes.get(route.from_chain)
		var to_node = _star_nodes.get(route.to_chain)
		
		if from_node and to_node:
			# Draw animated route line
			var color = route.color
			draw_line(from_node.position, to_node.position, color, 4.0)
			
			# Draw moving particle
			var t = route.progress
			var particle_pos = from_node.position.lerp(to_node.position, t)
			draw_circle(particle_pos, 8.0, color)

func _process(delta):
	# Update active route animations
	for i in range(_active_routes.size() - 1, -1, -1):
		var route = _active_routes[i]
		route.progress += delta * animation_speed
		
		if route.progress >= 1.0:
			_active_routes.remove_at(i)
			_on_route_completed(route)
	
	queue_redraw()

# ============================================================================
# TRANSACTION VISUALIZATION
# ============================================================================

func _on_transaction_sent(tx_hash: String):
	if not show_transactions:
		return
	
	var visual = _create_transaction_visual(tx_hash, "pending")
	_transaction_visuals[tx_hash] = visual
	add_child(visual)
	
	# Animate appearance
	var tween = create_tween()
	visual.modulate.a = 0.0
	tween.tween_property(visual, "modulate:a", 1.0, 0.3)
	tween.tween_property(visual, "scale", Vector2(1.1, 1.1), 0.2)
	tween.tween_property(visual, "scale", Vector2(1.0, 1.0), 0.1)

func _on_transaction_confirmed(tx_hash: String, receipt: Dictionary):
	var visual = _transaction_visuals.get(tx_hash)
	if visual:
		_update_transaction_visual(visual, "confirmed")
		
		# Success animation
		var tween = create_tween()
		tween.tween_property(visual, "modulate", confirmed_tx_color, 0.3)
		tween.tween_property(visual, "modulate:a", 0.0, 1.0)
		tween.tween_callback(func(): 
			visual.queue_free()
			_transaction_visuals.erase(tx_hash)
		)

func _on_transaction_failed(tx_hash: String, error: String):
	var visual = _transaction_visuals.get(tx_hash)
	if visual:
		_update_transaction_visual(visual, "failed")
		
		# Failure animation (shake)
		var tween = create_tween()
		var original_pos = visual.position
		tween.tween_property(visual, "position:x", original_pos.x + 10, 0.05)
		tween.tween_property(visual, "position:x", original_pos.x - 10, 0.05)
		tween.tween_property(visual, "position:x", original_pos.x, 0.05)
		tween.tween_property(visual, "modulate", failed_tx_color, 0.2)
		tween.tween_property(visual, "modulate:a", 0.0, 1.0)
		tween.tween_callback(func():
			visual.queue_free()
			_transaction_visuals.erase(tx_hash)
		)

func _create_transaction_visual(tx_hash: String, status: String) -> Node2D:
	var node = Node2D.new()
	node.name = "TX_" + tx_hash.substr(0, 8)
	
	# Transaction box
	var box = ColorRect.new()
	box.size = Vector2(150, 40)
	box.position = Vector2(-75, -20)
	box.color = pending_tx_color if status == "pending" else confirmed_tx_color
	node.add_child(box)
	
	# Hash label
	var label = Label.new()
	label.text = tx_hash.substr(0, 10) + "..."
	label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	label.size = Vector2(150, 20)
	label.position = Vector2(-75, -10)
	node.add_child(label)
	
	# Status label
	var status_label = Label.new()
	status_label.text = status.to_upper()
	status_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	status_label.size = Vector2(150, 20)
	status_label.position = Vector2(-75, 5)
	node.add_child(status_label)
	
	# Position near star center
	node.position = star_center + Vector2(randf_range(-100, 100), randf_range(-50, 50))
	
	return node

func _update_transaction_visual(visual: Node2D, status: String):
	var status_label = visual.get_node_or_null("StatusLabel")
	if status_label:
		status_label.text = status.to_upper()

# ============================================================================
# BLOCK VISUALIZATION
# ============================================================================

func _on_block_received(block_number: int):
	if not show_blocks:
		return
	
	var visual = _create_block_visual(block_number)
	_block_visuals.append(visual)
	add_child(visual)
	
	# Limit displayed blocks
	while _block_visuals.size() > 10:
		var old_block = _block_visuals.pop_front()
		old_block.queue_free()
	
	# Animate blocks sliding
	_animate_block_chain()

func _create_block_visual(block_number: int) -> Node2D:
	var node = Node2D.new()
	node.name = "Block_" + str(block_number)
	
	var box = ColorRect.new()
	box.size = Vector2(60, 60)
	box.position = Vector2(-30, -30)
	box.color = block_color
	node.add_child(box)
	
	var label = Label.new()
	label.text = str(block_number)
	label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	label.size = Vector2(60, 60)
	label.position = Vector2(-30, -30)
	node.add_child(label)
	
	# Position at right side of screen
	node.position = Vector2(1000, 100)
	
	return node

func _animate_block_chain():
	for i in range(_block_visuals.size()):
		var block = _block_visuals[i]
		var target_x = 1000 - (i * 70)
		
		var tween = create_tween()
		tween.tween_property(block, "position:x", target_x, 0.3)

# ============================================================================
# CROSS-CHAIN VISUALIZATION
# ============================================================================

func _on_cross_chain_sent(dest_chain: int, message_id: String):
	var chain_name = _get_chain_name_by_id(dest_chain)
	
	var route = {
		"from_chain": "ARBITRUM",
		"to_chain": chain_name,
		"message_id": message_id,
		"progress": 0.0,
		"color": CHAIN_COLORS.get(chain_name, Color.WHITE)
	}
	
	_active_routes.append(route)

func _on_route_completed(route: Dictionary):
	# Could emit signal or trigger callback
	pass

func _get_chain_name_by_id(chain_id: int) -> String:
	var id_to_name = {
		1: "ETHEREUM",
		42161: "ARBITRUM",
		137: "POLYGON",
		8453: "BASE",
		9001: "COSMOS",
		607: "TON",
		100: "GNOSIS",
		1110: "ENJIN",
		10: "OPTIMISM",
		43114: "AVALANCHE",
		56: "BSC",
		250: "FANTOM"
	}
	return id_to_name.get(chain_id, "UNKNOWN")

# ============================================================================
# GLYPH VISUALIZATION
# ============================================================================

func _on_glyph_executed(glyph_id: int, result: Dictionary):
	var glyph_data = ArbitrumEngine.GLYPHS.get(glyph_id, {})
	
	var visual = _create_glyph_visual(glyph_data)
	add_child(visual)
	
	# Animate glyph effect
	var tween = create_tween()
	visual.scale = Vector2(0.1, 0.1)
	visual.modulate.a = 0.0
	
	tween.tween_property(visual, "scale", Vector2(2.0, 2.0), 0.5)
	tween.parallel().tween_property(visual, "modulate:a", 1.0, 0.3)
	tween.tween_property(visual, "modulate:a", 0.0, 0.5)
	tween.tween_callback(visual.queue_free)

func _create_glyph_visual(glyph_data: Dictionary) -> Node2D:
	var node = Node2D.new()
	node.position = star_center
	
	# Glyph symbol (large)
	var label = Label.new()
	label.text = glyph_data.get("symbol", "?")
	label.add_theme_font_size_override("font_size", 72)
	label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	label.size = Vector2(200, 100)
	label.position = Vector2(-100, -50)
	node.add_child(label)
	
	# Function name
	var func_label = Label.new()
	func_label.text = glyph_data.get("function", "")
	func_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	func_label.size = Vector2(200, 30)
	func_label.position = Vector2(-100, 40)
	node.add_child(func_label)
	
	return node

# ============================================================================
# NFT RENDERING
# ============================================================================

func _on_nft_loaded(token_id: int, metadata: Dictionary, texture: Texture2D):
	# Could auto-display loaded NFTs
	pass

func create_nft_gallery(nfts: Array, start_position: Vector2, columns: int = 4) -> Node2D:
	var gallery = Node2D.new()
	gallery.position = start_position
	gallery.name = "NFTGallery"
	
	var spacing = Vector2(120, 140)
	
	for i in range(nfts.size()):
		var nft = nfts[i]
		var col = i % columns
		var row = i / columns
		
		var item = _create_nft_item(nft)
		item.position = Vector2(col * spacing.x, row * spacing.y)
		gallery.add_child(item)
	
	add_child(gallery)
	return gallery

func _create_nft_item(nft: Dictionary) -> Node2D:
	var node = Node2D.new()
	
	# Background
	var bg = ColorRect.new()
	bg.size = Vector2(100, 120)
	bg.color = Color(0.2, 0.2, 0.25, 0.9)
	node.add_child(bg)
	
	# Image (if texture available)
	if nft.has("texture") and nft.texture:
		var sprite = Sprite2D.new()
		sprite.texture = nft.texture
		sprite.position = Vector2(50, 45)
		sprite.scale = Vector2(0.5, 0.5)  # Adjust as needed
		node.add_child(sprite)
	
	# Name label
	var label = Label.new()
	var name = nft.get("metadata", {}).get("name", "NFT #" + str(nft.get("token_id", 0)))
	label.text = name.substr(0, 12)
	label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	label.size = Vector2(100, 20)
	label.position = Vector2(0, 95)
	node.add_child(label)
	
	return node

# ============================================================================
# UTILITY
# ============================================================================

func visualize_route(from_chain: String, to_chain: String, color: Color = Color.WHITE):
	var route = {
		"from_chain": from_chain,
		"to_chain": to_chain,
		"message_id": "",
		"progress": 0.0,
		"color": color
	}
	_active_routes.append(route)

func pulse_chain_node(chain_name: String, duration: float = 0.5):
	var node = _star_nodes.get(chain_name)
	if not node:
		return
	
	var tween = create_tween()
	var original_scale = node.scale
	tween.tween_property(node, "scale", original_scale * 1.3, duration / 2)
	tween.tween_property(node, "scale", original_scale, duration / 2)

func highlight_glyph(glyph_id: int):
	_on_glyph_executed(glyph_id, {})
