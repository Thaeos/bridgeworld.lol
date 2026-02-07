# Example Main Scene - Arbitrum Rendering Engine Demo
#
# This demonstrates the full capabilities of Godot as a rendering
# engine for Arbitrum blockchain interactions.

extends Node2D

# Engine references
@onready var engine: ArbitrumEngine = $ArbitrumEngine
@onready var renderer: BlockchainRenderer = $BlockchainRenderer
@onready var ui: CanvasLayer = $UI

# UI Elements
@onready var wallet_label: Label = $UI/WalletPanel/WalletLabel
@onready var balance_label: Label = $UI/WalletPanel/BalanceLabel
@onready var block_label: Label = $UI/StatusPanel/BlockLabel
@onready var glyph_grid: GridContainer = $UI/GlyphPanel/GlyphGrid

# State
var selected_glyph: int = -1

func _ready():
	_connect_signals()
	_setup_glyph_buttons()
	_update_ui()

func _connect_signals():
	# Engine signals
	engine.wallet_connected.connect(_on_wallet_connected)
	engine.wallet_disconnected.connect(_on_wallet_disconnected)
	engine.transaction_sent.connect(_on_tx_sent)
	engine.transaction_confirmed.connect(_on_tx_confirmed)
	engine.block_received.connect(_on_block_received)
	engine.glyph_executed.connect(_on_glyph_executed)
	engine.cross_chain_message_sent.connect(_on_cross_chain_sent)

func _setup_glyph_buttons():
	# Create buttons for all 22 Aramaic glyphs
	for glyph_id in ArbitrumEngine.GLYPHS.keys():
		var glyph = ArbitrumEngine.GLYPHS[glyph_id]
		
		var button = Button.new()
		button.text = glyph.symbol + "\n" + glyph.name
		button.custom_minimum_size = Vector2(80, 60)
		button.tooltip_text = glyph.function
		button.pressed.connect(_on_glyph_button_pressed.bind(glyph_id))
		
		glyph_grid.add_child(button)

func _update_ui():
	if engine.is_connected():
		wallet_label.text = "Wallet: " + engine.format_address(engine.get_wallet_address())
		_fetch_balance()
	else:
		wallet_label.text = "Wallet: Not Connected"
		balance_label.text = "Balance: --"

func _fetch_balance():
	var balance_hex = await engine.get_balance(engine.get_wallet_address())
	var balance_eth = engine.wei_to_eth(balance_hex)
	balance_label.text = "Balance: %.4f ETH" % balance_eth

# ============================================================================
# UI CALLBACKS
# ============================================================================

func _on_connect_button_pressed():
	if engine.is_connected():
		engine.disconnect_wallet()
	else:
		engine.connect_wallet()

func _on_glyph_button_pressed(glyph_id: int):
	selected_glyph = glyph_id
	
	# Visual feedback
	renderer.highlight_glyph(glyph_id)
	
	# Show confirmation dialog
	var glyph = ArbitrumEngine.GLYPHS[glyph_id]
	var dialog = AcceptDialog.new()
	dialog.title = "Execute Glyph"
	dialog.dialog_text = "Execute %s (%s)?\n\nFunction: %s" % [glyph.name, glyph.symbol, glyph.function]
	dialog.confirmed.connect(_execute_selected_glyph)
	add_child(dialog)
	dialog.popup_centered()

func _execute_selected_glyph():
	if selected_glyph >= 0:
		var result = await engine.execute_glyph(selected_glyph)
		print("Glyph execution result: ", result)

func _on_bridge_button_pressed(chain_name: String):
	var chain_id = ArbitrumEngine.STAR_CHAINS.get(chain_name, 0)
	if chain_id > 0:
		# Visualize route
		renderer.visualize_route("ARBITRUM", chain_name, BlockchainRenderer.CHAIN_COLORS[chain_name])
		
		# Execute bridge
		var tx_hash = await engine.bridge_to_chain(chain_id, "ETH", "0.01")
		print("Bridge tx: ", tx_hash)

func _on_load_nft_pressed(contract: String, token_id: int):
	var nft_data = await engine.load_nft(contract, token_id)
	print("NFT loaded: ", nft_data)

# ============================================================================
# ENGINE SIGNAL HANDLERS
# ============================================================================

func _on_wallet_connected(address: String):
	_update_ui()
	print("Wallet connected: ", address)

func _on_wallet_disconnected():
	_update_ui()
	print("Wallet disconnected")

func _on_tx_sent(tx_hash: String):
	print("Transaction sent: ", tx_hash)

func _on_tx_confirmed(tx_hash: String, receipt: Dictionary):
	print("Transaction confirmed: ", tx_hash)
	_fetch_balance()

func _on_block_received(block_number: int):
	block_label.text = "Block: #%d" % block_number

func _on_glyph_executed(glyph_id: int, result: Dictionary):
	var glyph = ArbitrumEngine.GLYPHS[glyph_id]
	print("Glyph executed: %s (%s)" % [glyph.symbol, glyph.name])

func _on_cross_chain_sent(dest_chain: int, message_id: String):
	print("Cross-chain message sent to chain %d: %s" % [dest_chain, message_id])

# ============================================================================
# DEMO FUNCTIONS
# ============================================================================

func demo_star_visualization():
	# Animate routes through the 13-point star
	var chains = ["ETHEREUM", "POLYGON", "BASE", "COSMOS", "TON", "ENJIN"]
	
	for chain in chains:
		renderer.visualize_route("ARBITRUM", chain, BlockchainRenderer.CHAIN_COLORS[chain])
		await get_tree().create_timer(0.5).timeout

func demo_glyph_sequence():
	# Execute a sequence of glyphs (visual only)
	var sequence = [0, 4, 7, 12, 21]  # Aleph, He, Heth, Mem, Tav
	
	for glyph_id in sequence:
		renderer.highlight_glyph(glyph_id)
		await get_tree().create_timer(1.0).timeout

func demo_nft_gallery():
	# Load and display NFT gallery
	var nfts = []
	
	# Load Legions NFTs (example)
	for i in range(8):
		var nft = await engine.load_nft(ArbitrumEngine.LEGIONS_NFT, i + 1)
		nfts.append(nft)
	
	renderer.create_nft_gallery(nfts, Vector2(50, 500), 4)
