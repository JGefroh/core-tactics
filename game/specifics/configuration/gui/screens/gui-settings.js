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
            }
        },
        'large_menu_panel': {
            position: {
                strategy: 'canvas', 
                offsetX: 400,
                offsetY: 200
            },
            appearance: {
                fillColor: 'rgba(255,0,0,1)',
            },
            size: {
                strategy: null, 
                width: 800,
                height: 500
            },
            layout: {
                strategy: 'vertical',   // vertical, horizontal, 'next-vertical', 'next-horizontal'
                marginY: 10
            },
        },
    },
    "instances": {
        panel: {
            element: 'panel',
            children: {
                title: {
                    element: 'title',
                    text: 'Settings',
                },
                subtitle: {
                    element: 'subtitle',
                },
                menu_panel: {
                    element: 'menu_panel',
                    children: {
                        category: {
                            element: 'menu_button',
                            text: 'Audio',
                            onClick: {
                                command: 'START_GAME',
                                params: { }
                            }
                        },
                    }
                }
            }
        },
        large_menu_panel: {
            element: 'large_menu_panel',

            children: {
                category: {
                    element: 'menu_button',
                    text: 'Master volume',
                    onClick: {
                        command: 'START_GAME',
                        params: { }
                    }
                },
            }
        }
    }
}


export default guiConfiguration;