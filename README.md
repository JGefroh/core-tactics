# Tactics

Tactics is a 2d tactical "RTS" game that serves as a tech demo for my [core-js](https://github.com/jgefroh/core-js) framework.

It is written in pure Javascript w/ Canvas and WebGL2 rendering and no other frameworks.

It's fully playable at http://tactics.jgefroh.com.

This is not intended to be used in a commercial or production environment - it was just a fun hobby project I wrote.

![output](https://github.com/user-attachments/assets/bf428686-16a6-4844-9108-abfcd3040422)

![Screenshot 2025-06-15 at 7 19 40 PM](https://github.com/user-attachments/assets/8fca09d8-9fc2-4b6c-a180-913fb5807359)

![Screenshot 2025-06-15 at 6 20 07 PM](https://github.com/user-attachments/assets/a3337448-8f27-44d7-9f2f-a3cca062d66d)


---

# Random tidbits

There's quite a few different enhancements this has over my prior efforts like [Light](https://github.com/jgefroh/core-light).

* Bootstrapping the game now has Scene manager which makes it very easy to set up different scenes for title screen, the game loop, or even an editor.
* The rendering system was completely re-written to be a lot faster an easier to extend. It now supports blitting, entity-specific rendering programs.
* Rendering also supports shader-level enhancements like a tone (ie. pure white can be shaded a specific color - useful for unit identification)
* The GUI system was enhanced - instead of being canvas, it now uses the standard rendering pipeline. It still uses Canvas for text, though.
* The GUI now also supports elements that are tied to a specific Entity with its own define and update lifecycle.
* The movement system was enhanced to support a multi-step movement: Proposal -> Collision -> Finalization.
* The FX system has been consolidated into an engine-level system that can have FX classes registered to it. This makes management and triggering of FX much easier.
* The input is now set up in three phases - input receive, input interpretation, and command execution. This further makes it easier to manage different player commands.
* The AI system was adjusted to have scores dynamically definable so actions can be reused within different contexts.
* The AI system now also has the concept of a state informer to make it easier to collect world data per entity.
* The Weapon system was generalized a bit to be less tied into a specific weapon.
* Core received some updates related to ease-of-use including associations with child entities.
