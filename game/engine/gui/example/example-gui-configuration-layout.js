const guiConfiguration = {
    definedElements: {
        'menu_panel': {
            position: {
                strategy: 'canvas', // One of - 'world', 'canvas'
                anchor: 'center', // top-left, top-right, bottom-left, bottom-right, center, left-center, right-center, top-center, bottom-center, top, left, right, bottom
            },
            size: {
                strategy: null, // 'fixed' (default), 'stretch-xy', 'stretch-x', 'stretch-y'
                width: 100,
                height: 100,
            },
            layout: {
                strategy: 'next-vertical',   // vertical, horizontal, 'next-vertical', 'next-horizontal'
                marginX: 10,
                marginY: 0
            },
            appearance: {
                fillColor: 'rgba(255,0,0,1)'
            }
        },
        'menu_button': {
            position: {
                strategy: 'fit-content', // fit, fixed
                width: 100,
                height: 100,
                minWidth: 100,
                minHeight: 100,
                // maxWidth: 100,
                // maxHeight: 100
            },
        }
    },
    "instances": {
        "menu_panel_top_left": {
            "element": "menu_panel",
            "position": { "anchor": "top-left" },
        },
        "menu_panel_top_center": {
            "element": "menu_panel",
            "position": { "anchor": "top-center" },
            children: {
                "menu_panel_top_left_center_1": {
                    "element": "menu_panel",
                    "position": { "anchor": "top-left" },
                    appearance: {
                        fillColor: 'green'
                    },
                    size: {
                        width: 30,
                        height: 30
                    }
                },
                "menu_panel_top_left_center_2": {
                    "element": "menu_panel",
                    "position": { "anchor": "top-left" },
                    appearance: {
                        fillColor: 'green'
                    },
                    size: {
                        width: 30,
                        height: 30
                    }
                },
                new_game_button: {
                    element: 'menu_button',
                    text: 'New Game',
                    onClick: {
                        command: 'PRINT',
                        params: { type: 'new game' }
                    }
                },
            }
        },
        "menu_panel_top_right": {
            "element": "menu_panel",
            "position": { "anchor": "top-right" }
        },
        "menu_panel_left_center": {
            "element": "menu_panel",
            "position": { "anchor": "left-center" }
        },
        "menu_panel_center": {
            "element": "menu_panel",
            "position": { "anchor": "center" }
        },
        "menu_panel_right_center": {
            "element": "menu_panel",
            "position": { "anchor": "right-center" }
        },
        "menu_panel_bottom_left": {
            "element": "menu_panel",
            "position": { "anchor": "bottom-left" }
        },
        "menu_panel_bottom_center": {
            "element": "menu_panel",
            "position": { "anchor": "bottom-center" }
        },
        "menu_panel_bottom_right": {
            "element": "menu_panel",
            "position": { "anchor": "bottom-right" }
        },
        "menu_panel_center_stretch_y": {
            "element": "menu_panel",
            "position": { "anchor": "center" },
            size: { 
                strategy: 'stretch-y',
                width: 10,
            },
            "appearance": {
                fillColor: 'blue'
            }
        },
        "menu_panel_center_stretch_x": {
            "element": "menu_panel",
            "position": { "anchor": "center" },
            size: { 
                strategy: 'stretch-x',
                height: 10,
            },
            "appearance": {
                fillColor: 'blue'
            }
        },
    }

}


export default guiConfiguration;