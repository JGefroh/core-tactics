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
            text: 'by Joseph Gefroh'
        },
        'menu_panel': {
            position: {
                strategy: 'canvas', 
                anchor: 'top-left', 
                offsetY: 20
            },
            size: {
                strategy: null, 
                width: 300,
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
        }
    },
    "instances": {
        panel: {
            element: 'panel',
            children: {
                title: {
                    element: 'title',
                    text: 'Tactics',
                },
                subtitle: {
                    element: 'subtitle',
                },
                menu_panel: {
                    element: 'menu_panel',
                    children: {
                        new_game_button: {
                            element: 'menu_button',
                            text: 'Start Game',
                            onClick: {
                                command: 'SEND',
                                params: { event: 'LOAD_SCENE', sceneKey: 'game' }
                            }
                        },
                        how_to_play: {
                            element: 'menu_button',
                            text: 'How to Play',
                            onClick: {
                                command: 'LOAD_GUI',
                                params: { gui: 'how-to-play' }
                            },
                        },
                        // settings: {
                        //     element: 'menu_button',
                        //     text: 'Settings',
                        //     onClick: {
                        //         command: 'LOAD_GUI',
                        //         params: { gui: 'settings' }
                        //     },
                        // },
                        source_button2: {
                            element: 'menu_button',
                            appearance: {
                                fillColor: 'rgba(0,0,0,0)'
                            }
                        },
                        source_button: {
                            element: 'menu_button',
                            text: 'View Source Code',
                            onClick: {
                                command: 'GO_TO_SITE',
                                params: { href: 'https://github.com/jgefroh', newWindow: true }
                            },
                        }
                    }
                }
            }
        }
    }

}


export default guiConfiguration;