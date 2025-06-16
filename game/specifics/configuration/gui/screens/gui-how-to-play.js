const guiConfiguration = {
    definedElements: {
        'panel': {
            position: {
                strategy: 'canvas', 
                anchor: 'left-center', 
                offsetX: 20,
            },
            size: {
                strategy: null, 
                width: 300,
                height: 300
            },
            layout: {
                strategy: 'vertical',   // vertical, horizontal, 'next-vertical', 'next-horizontal'
                marginX: 10,
                marginY: 10
            }
        },
        'title': {
            position: {
                strategy: 'canvas', 
                anchor: 'left-top', 
            },
            size: {
                strategy: null, 
                width: 300,
                height: 48
            },
            font: {
                color: 'white',
                fontSize: 48,
            },
            layout: {
                strategy: 'vertical',   // vertical, horizontal, 'next-vertical', 'next-horizontal'
                marginX: 10,
                marginY: 10
            }
        },
        'subtitle': {
            position: {
                strategy: 'canvas', 
                anchor: 'left-top', 
            },
            size: {
                strategy: null, 
                width: 300,
                height: 20
            },
            font: {
                color: 'white',
                fontSize: 20,
            },
            text: ''
        },
        'menu_panel': {
            position: {
                strategy: 'canvas', 
                anchor: 'top-left', 
                offsetY: 20
            },
            size: {
                strategy: null, 
                width: 800,
                height: 100
            },
            layout: {
                strategy: 'vertical',   // vertical, horizontal, 'next-vertical', 'next-horizontal'
                marginY: 10
            },
        },
        'menu_button': {
            position: {
                anchor: 'top-left',
                strategy: 'fit-content', // fit, fixed,
            },
            appearance: {
                fillColor: 'rgba(0,0,0,0)',
            },
            font: {
                color: 'white',
                fontSize: 18,
            },
            size: {
                width: 200,
                height: 20,
            },
            onHover: {
                command: 'PRINT',
                params: { type: 'CHANGE' }
            },
            hoverStyles: {
                fillColor: 'rgb(177, 177, 177)'
            }
        },
        'instructions':  {
            position: {
                anchor: 'top-left',
                strategy: 'fit-content', // fit, fixed,
                offsetY: 30
            },
            appearance: {
                fillColor: 'rgba(0,0,0,0)',
            },
            font: {
                color: 'white',
                fontSize: 18,
            },
            size: {
                width: 600,
                height: 20,
            },
        }
    },
    "instances": {
        panel: {
            element: 'panel',
            children: {
                title: {
                    element: 'title',
                    text: 'How to Play',
                },
                subtitle: {
                    element: 'subtitle',
                },
                menu_panel: {
                    element: 'menu_panel',
                    children: {
                        new_game_button: {
                            element: 'menu_button',
                            text: 'Back to main menu',
                            onClick: {
                                command: 'LOAD_GUI',
                                params: { gui: 'main-menu' }
                            }
                        },
                        instructions: {
                            element: 'instructions',
                            text: "Unit Selection & Movement\n.....Left-click a unit to select it.\n.....Right-click a location or enemy to move or attack.\n.....Select multiple units by clicking and dragging around them.\n.....Incrementally select or unselect units by holding Shift.\n\nControl Groups\n.....Press 1-12 to select a control group.\n.....Press Ctrl+1-12 to assign selected units to a control group.\n\nCommands\n.....Press S to make selected units defend their current area.\n\nFormations\n.....Hold Shift and press Q, W, E, or R to apply a formation preset.",
                            position: {
                                width: 700
                            }
                        }
                    }
                }
            }
        }
    }
}


export default guiConfiguration;