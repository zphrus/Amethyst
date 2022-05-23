import { onKeyStroke, useLocalStorage } from "@vueuse/core";
import type Player from "./player";

export type ShortcutBindings = Record<string, [string[], () => void]>;
export type CustomShortcutBindings = Record<string, string[]>;

export default class Shortcuts {
  public DEFAULT_BINDINGS: ShortcutBindings = {
    "audio.play.pause": [["MediaPlayPause", " "], () => this.player.isPlaying() ? this.player.pause() : this.player.play()],
    "audio.play": [["MediaPlay"], () => this.player.play()],
    "audio.pause": [["MediaPause"], () => this.player.pause()],
    "audio.next": [["MediaTrackNext"], () => this.player.next()],
    "audio.previous": [["MediaTrackPrevious"], () => this.player.previous()],
    "audio.seek.forward": [["ArrowRight"], () => this.player.seekForward()],
    "audio.seek.backward": [["ArrowLeft"], () => this.player.seekBackward()],
    "audio.volume.up": [["PageUp", "ArrowUp"], () => this.player.volumeUp()],
    "audio.volume.down": [["PageDown", "ArrowDown"], () => this.player.volumeDown()],
  };

  public bindings = this.DEFAULT_BINDINGS;
  public customBindings = useLocalStorage<CustomShortcutBindings>("customShortcuts", {}).value;

  constructor(public player: Player) {
    this.registerShortcuts();
  }

  public registerShortcuts() {
    for (let i = 0; i < Object.entries(this.bindings).length; i++) {
      const [actionName] = Object.entries(this.bindings)[i];
      const [defaultKeys, action] = this.bindings[actionName];

      // Get the user config keys
      const customKeys = this.customBindings[actionName];

      // Replace the defaults with the user's options
      const keys = customKeys || defaultKeys;

      // Register the event for each key
      for (let j = 0; j < keys.length; j++)
        onKeyStroke(keys[j], action);
    }
  }
}
