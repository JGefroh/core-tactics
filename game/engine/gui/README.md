# gui

The GUI package handles everything related to user interface elements.

There are several different kinds of GUI elements:

* Screens
* Elements
  * Entity-attached
  * Non-entity attached

Screens are pre-defined layouts of GUI elements defined declaratively as JS/JSON. Think thing like menus, etc.

Elements are specific GUI components with their own behavior, etc.

* An Element that is attached to an entity is rendered in World-space (such as a health bar aboe an enemy's head) and will depend on the Entity's lifecycle. 
* An Element that is not attached to an entity is rendered in Screen-space (such as a menu item).
* There are elements that are both attached to an entity AND rendered in screenspace (eg. a GUI element indicating a "selected unit").

There are also complex GUI elements that have their own ECS system - eg. a MinimapSystem renders and processes the logic for displaying entities on a Minimap.

****
**ECS**
Entities that are GUI elements are defined with GuiCanvasRenderComponent.

**Defining**
Screen-space GUI layouts are defined declaratively in JS/JSON files such as `example-gui-configuration-layout.js`.

**Attaching**
GuiAttachmentSystem handles world-space GUI elements, or GUI elements attached to an Entity lifecycle, using GuiAttachmentComponent on entities.

**Loadingm**
GuiLoaderSystem processes the definitions and convers them into actual GUI Entities.

**Rendering**  
RenderGuiSystem handles rendering of GUI elements in either screen or world space, as well as accepting update properties.

**Interaction**
GuiInteactionSystem handles clicks, hovers, and other user interactions with the various GUI elements.