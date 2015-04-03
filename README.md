# LFX

System for managing and controlling lights. The system is controllable over a network with a REST HTTP API. LFX is primarily designed to control strands of LEDs, though it has support for anything ranging from a simple binary on/off bulb to a full LED matrix or screen. LFX can be used as a way to illuminate a room, house, or potentially create a light show.

## Terminology

### LFX Server

The LFX server is the software (this software) that controls zero or more fixtures and coordinates everything.

### Slave LFX Server

A slave LFX server remains in communication with the master LFX server in order to "extend" the reach of the master. For example, you might have a master LFX server in your living room that acts as the brain for a house-wide system. You then could place a slave LFX server in your bedroom with LEDs attached to it via SPI or USB. This slave would then listen to the master for commands to pass onto the fixtures that the slave controls.

The benefit of having a master-slave architecture is that is allows for the LFX system to encompass a whole building, or potentially a complex of buildings, while keeping the architecture simple (masterless systems are much more complex). 

### Source

A source is an individual, controllable piece of hardware that illuminates-- it's a source of light. This can be something like a light bulb, a single LED (even on an LED strand, each LED is its own source), or a pixel on a screen. A light source is the single smallest unit a LFX system can be broken down to.

### Fixture

A fixture is a logical grouping of light sources. For example, a complete strand of LEDs would be considered a fixture. A fixture can have one or more light sources in it. Anything from a bulb to a LCD screen could be considered a fixture.

Fixtures do not necessarily need to be controlled by separate physical hardware controllers.

Fixtures have other user-defined properties, such as a name and description. A unique ID is generated for each fixture by the system.

### Fixture Model

A fixture model is a set of metadata describing a specific set of hardware's capabilities. 

There are several different types of fixtures, with each fixture model having one of the properties of each category listed below:

- Single source or multisource
- Single color, multicolor, or omnicolor
- Binary level, multilevel, or omnilevel

### Single Source Fixture

Single source fixtures have only one light source within the fixture. For example, a lightbulb or LED bulb with a single controllable element would be considered a single source fixture. Note that even if a fixture technically has more than one point of light emission (e.g. red, blue, and green subpixels or LEDs), it is still considered a single source fixture if each subpixel is controlled in unison.

### Multisource Fixture

A multisource fixture has more than one controllable light source within it. For example, a strand of LEDs would be considered a multisource fixture.

### Single Color Fixture

A single color fixture is, as the name implies, a fixture that can only display a single color. For example, a conventional lightbulb would be a single color fixture.

### Multicolor Fixture

A multicolor fixture can display a predefined set of colors. Note that though all fixtures can technically be considered multicolor (i.e. every light source has a color range), multicolor light sources generally have a set of predefined colors that do not correspond to a linear range. For example, some multicolor LED mice have a specific set of colors they can display (red, teal, green, etc.), but they cannot display just any RGB color.

### Omnicolor Fixture

Omnicolor fixtures can output light in a predefined range of values. For example, an RGB LED strand would be considered an omnicolor fixture because it can display light in a range of RGB values.

### Binary Level Fixture

A binary level fixture can only display two levels of light-- "on", or "off".

### Multilevel Fixture

A multilevel fixture can only display light at predefined levels. Note that though all fixtures could technically be considered multilevel (as will the multicolor vs omnicolor), multilevel fixtures may not have a linear range (e.g. low, medium, high).

### Omnilevel Fixture

An omnilevel fixture can display light in a range of brightness levels, similar to how omnicolor fixtures can display a range of colors.

### Fixture Group

A fixture group is a logical group of fixtures and can contain zero or more fixtures inside of it. Generally, fixture groups are used for organizational purposes by the end user. Fixture groups can also be nested-- one group can contain any number of groups within it with infinite depth.

Fixture groups often are used for grouping different fixtures into sections, rooms, or other logical groups.

A single fixture can only be a part of one fixture group at a time.

### Connector

A connector is a code module that interfaces with hardware. For example, an SPI connector could be used to interface with a strand of LEDs over the SPI protocol. Alternatively, a Phillips Hue connector could be used to control Phillips Hue hardware. Each fixture has a single connector.

### Command

A command is a set of instructions that can be issued to a fixture. The command can be something as simple as "set color to XXX", or "display chase animation". If a fixture is not capable of fulfilling a command (e.g. a command such as "set color to red" is sent to a single color fixture), the fixture can either improvise or ignore the command entirely.

### Animation

An animation is a piece of code that constantly updates a fixture's light sources. The animation is run in a loop determined by the maximum framerate of the fixture. Animations can either react from outside data sources (e.g. a microphone for beat detection, or even from the Internet to allow for dynamic lighting based on weather, Tweets, etc.), or in a predetermined manner.

### Scene

A scene is a predefined set of commands to run. 

For example, you might have a "bedtime" scene that turns all overhead fixtures off and turns on accent lighting as a nightlight. Or, you could have a "party" scene that turns on a beat matching animation for your "living room" fixture group and illuminates your porch so guests can see your house.

## Fixture Model

Fixture model metadata files allow for users to define capabilities of different hardware. Metadata files should be included in the main LFX repository, with one file per hardware model in JSON format.

Fixture model metadata files should be in the following format, with the appropriate fields filled out depending on the model's capabilities:

```
{
	"name": "Name of the fixture model",
	"description": "Description of the fixture model",
	
	"capabilities": {
		"source": "single|multi",
		"color": "single|multi|omni",
		"level": "binary|multi|omni"
	},
	
	"source": {
		
	}
}
```

## Connectors

LFX allows for user-developed connectors. This architecture allows for developers to write connectors to suit their own needs, or download connectors developed by others.

### Specification

Connectors must implement the following specification:

Connectors must be defined in separate Node.js modules. Each module should only handle one type of fixture. For example, though it would be possible to implement a connector that connects to lights over SPI *and* serial connections, two separate connectors should be developed instead.

Each connector module should export a Javascript object that can be instantiated by the LFX system. For example, a connector's source code might look something like this:

```
var Connector = function(options) {
	// ...
};

Connector.prototype.method = function() {
	// ...
};

// ...

module.exports = Connector;
```

#### static `metadata()`

The static method "metadata" should return an object with information about the connector.

#### constructor(Object)

The connector constructor must take a single options object. This options object will contain 