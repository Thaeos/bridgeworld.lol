@tool
extends EditorPlugin

const ArbitrumEngineScript = preload("res://addons/arbitrum_engine/arbitrum_engine.gd")
const BlockchainRendererScript = preload("res://addons/arbitrum_engine/nodes/blockchain_renderer.gd")

func _enter_tree():
	# Add custom types
	add_custom_type(
		"ArbitrumEngine",
		"Node",
		ArbitrumEngineScript,
		preload("res://addons/arbitrum_engine/icons/engine_icon.svg") if FileAccess.file_exists("res://addons/arbitrum_engine/icons/engine_icon.svg") else null
	)
	
	add_custom_type(
		"BlockchainRenderer",
		"Node2D",
		BlockchainRendererScript,
		preload("res://addons/arbitrum_engine/icons/renderer_icon.svg") if FileAccess.file_exists("res://addons/arbitrum_engine/icons/renderer_icon.svg") else null
	)
	
	print("[Arbitrum Engine] Plugin loaded")
	print("  - ArbitrumEngine node available")
	print("  - BlockchainRenderer node available")
	print("  - Diamond Contract: 0xf7993A8df974AD022647E63402d6315137c58ABf")

func _exit_tree():
	remove_custom_type("ArbitrumEngine")
	remove_custom_type("BlockchainRenderer")
	print("[Arbitrum Engine] Plugin unloaded")
