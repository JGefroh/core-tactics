const guiConfiguration = {
    definedElements: {
        'panel': {
            position: {
                strategy: 'canvas',
                anchor: 'bottom-right', 
            },
            size: {
                strategy: null,
                height: 50
            },
            layout: {
                strategy: 'horizontal',   // vertical, horizontal, 'next-vertical', 'next-horizontal'
                marginY: 0
            },
            appearance: {
                fillColor: 'rgba(255,0,0,1)',
            },
        },
        'subpanel': {
            position: {
                strategy: 'canvas',
            },
            size: {
                strategy: null,
                height: 50
            },
            layout: {
                strategy: 'vertical',   // vertical, horizontal, 'next-vertical', 'next-horizontal'
                marginX: 10,
                marginY: 0
            },
            appearance: {
                fillColor: 'rgba(0,0,0,0)',
            },
        },
        'button': {
            position: {
            },
            size: {
                strategy: null,
                width: 100,
                height: 25
            },
            layout: {
                strategy: 'vertical',   // vertical, horizontal, 'next-vertical', 'next-horizontal'
            },
            appearance: {
                fillColor: 'rgba(0,255,0,1)',
            },
            font: {
                color: 'white',
                fontSize: 18,
            },
        },
        'button_text': {
            position: {
                anchor: 'center',
            },
            size: {
                width: 1,
                height: 12
            },
            layout: {
            },
            font: {
                color: 'white',
                fontSize: 18,
            },
        }
    },
    "instances": {
        command_panel: {
            element: 'panel',
            size: {
                width: 200,
            },
            children: {
                subpanel_left: {
                    element: 'subpanel',
                    position: {
                    },
                    size: {
                        width: 100,
                    },
                    children: {
                        select_button: {
                            element: 'button',
                            children: {
                                select_button_text: {
                                    element: 'button_text',
                                    text: 'Select'
                                }
                            }
                        },
                        attack_button: {
                            element: 'button',
                            children: {
                                select_button_text: {
                                    element: 'button_text',
                                    text: 'Attack'
                                }
                            }
                        },
                    }
                },
                subpanel_right: {
                    element: 'subpanel',
                    size: {
                        width: 100,
                    },
                    children: {
                        move_button: {
                            element: 'button',
                            children: {
                                move_button_text: {
                                    element: 'button_text',
                                    text: 'Move'
                                }
                            }
                        },
                        defend_button: {
                            element: 'button',
                            children: {
                                select_button_text: {
                                    element: 'button_text',
                                    text: 'Defend'
                                }
                            }
                        },
                    }
                },
            }
        }
    }
}


export default guiConfiguration;