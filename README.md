# LFX

System for managing and controlling lights. The system is controllable over a network with a TCP/HTTP JSON-RPC API as well as a HTTP web interface. Different types of illumination devices can be controlled with different "connectors", and multiple fixtures are supported per LFX controller. Each LFX server can also pass on commands to other "slave" LFX servers, which allows for scenarios where you may have multiple Raspberry Pi devices connected to LED strands over SPI and allows the user to control ALL of these strands over a network connection from a master LFX server.

LFX is distributed under the GNU GPLv3 license.

*Note: The following API documentation is under development and is not complete. Additionally, not all API functionality listed here is functional.*

## Installation

LFX requires Node.js v0.10.20 or higher. Once this repository has been cloned onto the computer to run the server software, simply run `npm install` to download and compile all dependencies.

### Raspberry Pi

To use the SPI connector, you must also [remove the SPI driver from the blacklist](http://nwazet.com/code/loading-i2c-spi-and-1-wire-drivers-on-the-raspberry-pi-under-raspbian-wheezy).

## Usage

The LFX server must be run on the computer that has control of the LED strand. For example, LFX with the SPI connector may be run directly on a Raspberry Pi, or on a Mac or Windows PC with a serial connector.

To start the LFX server, use the following command:

```
node src/index.js
```

To run as a background daemon, the `-d` command line switch may be used:

```
node src/index.js -d
```

When run as a daemon, the LFX process will be forked and run in the background. The command will then return.

If using a Raspberry Pi (or similar) and the SPI connector, you may have to run LFX as `sudo` to access the SPI device.

### Command Line Parameters

Other command line parameters for the LFX server include:

```
--help, -h    Display help for LFX
--config, -c  Path to the configuration file.
--daemon, -d  Start the process as a daemon.  [default: false]
```

## Configuration

A JSON configuration file may be specified to alter LFX's default HTTP and TCP servers, as well as configure other options such as the number of LEDs.

A sample configuration file is below with the default values.

```
{
	"leds": 25,
	
	"connector": "spi",
	"connector.options": {
		"device": "/dev/spidev0.0",
		"mode": 0
	},
	
	"http.server": false,
	"http.address": "0.0.0.0", // Address to bind to
	"http.port": 80,

	"tcp.server": true,
	"tcp.address": "0.0.0.0", // Address to bind to
	"tcp.port": 9123
}
```

The configuration file may be specified with the `-config` command line flag:

```
node src/index.js -c config.json
```

## Connectors

LFX is designed to support management of LEDs over multiple types of interfaces. Initially, LFX has support for SPI connected LEDs, such as the WS2801 strand [sold by Adafruit](http://www.adafruit.com/products/738).

Potential future connectors include:

- Serial (to facilitate PC/Mac-Arduino-LED connections, for example)
- TCP/UDP socket

### Specification

Each connector must take a configuration object in its constructor. The contents of this object are taken from the configuration file loaded by LFX.

Additionally, the connector must implement a single method-- `render(Buffer)`. The render method accepts a Buffer of length `3 * LEDs`. The buffer passed into the render method is guaranteed to be a length divisible by 3 and contain bytes representing RGB values, with each triplet representing a single LED's state.

## Animations

Animations are modules designed to allow for continuous update of LEDs and display of patterns. Animations may be configured for the entire strand of LEDs or a subset. Each animation must not require a minimum or maximum strand length, as they may be applied for a single LED or an entire strand of hundreds.

Animations must be packaged as NPM modules that conform to the following specification. There are several methods each animation must implement:

### Animation(Object, LFXLightManager)

**Parameters**

- `Object` - The object will contain options for the animation to initialize with. The options object will always contain a `length` property that indicates the number of LEDs the animation is responsible for, as well as an `offset` property indicating the starting index of the LEDs to manage.
- `LFXLightManager (Object)` - The [LFX light manager](https://github.com/andrewmunsell/lfx-light-manager) of this animation. This reference is used to register for message notifications.

The constructor must accept an object containing options for the animation.

### render(Number)

**Parameters**

- `Number` - Delta time (change in time) since the last render call in milliseconds

The render method must render the current animation onto the LFX Light Manager instance passed to it during initialization. See the documentation for the LFX Light Manager for more information on the methods available to the animations.

### setOptions(Object)

**Parameters**

- `Object` - New options to set. This may include new `offset` and `length` properties as well.

Set the animation's options to the object passed. Requirements are similar to the object passed into the constructor.

## JSON-RPC API

The API is JSON-RPC 2.0 compliant and has several methods for managing the raw pixel data, as well as animations. It can be accessed over a TCP socket or over HTTP.

To use the TCP API, connect to the IP address or hostname and port of the LFX server and send any of the following methods over the TCP socket.

To use the HTTP API, a `POST` request must be sent to the root endpoint with the body containing a valid JSON-RPC command.

In general, the API will respond with no other data. For example:

```
{
	"jsonrpc": "2.0",
	"id": "2fde31ad"
}
```

Alternatively, an error may be returned according to the JSON-RPC specification:

```
{
	"jsonrpc": "2.0",
	"error": {
		"code": -32602,
		"message": "LED index out of bounds"
	},
	"id": "3fed39c0"
}
```

Most API methods are performed on a subset of the fixtures the LFX server controls. The matched fixtures can be specified with the first parameters for methods that support it.

#### Error Codes

Possible error codes returned by the API include the existing JSON-RPC specification error codes, as well as the following:

##### -32001 - LED index out of bounds

The specified offset for the called method was invalid due to being out of the bounds of the LEDs. For example, this error will occur when the index specified is less than 0 or greater than or equal to the number of LEDs.

##### -32002 - Fixture not found

This error is returned if there were no fixtures that matched the specified criteria, or if the fixture index provided was out of bounds.

### set

**Parameters**

- `fixture` - Fixture filter parameters. Can be a numeric fixture offset, a string based fixture ID, or an array of fixture tags. If null is provided, all fixtures will be matched.
- `offset` - LED to set. 0 index based.
- `r` - Red value from 0 to 255
- `g` - Green value from 0 to 255
- `b` - Blue value from 0 to 255

Sets the individual LED at `offset` to the specified RGB color. If an animation is currently running and renders to this LED, it will overwrite this value during the next render cycle. Otherwise, this LED will stay lit until another `set` is called on this LED, the LED fixture is cleared, or an animation renders onto this LED.

### setHSL

**Parameters**

- `fixture` - Fixture filter parameters. Can be a numeric fixture offset, a string based fixture ID, or an array of fixture tags. If null is provided, all fixtures will be matched.
- `offset` - LED to set. 0 index based.
- `h` - Hue value from 0 to 360
- `s` - Saturation value from 0 to 1
- `l` - Lightness value from 0 to 1

Sets the individual LED at `offset` to the specified HSL value. Behavior is similar to the `set` method.

### clear

**Parameters**

- `fixture` - Fixture filter parameters. Can be a numeric fixture offset, a string based fixture ID, or an array of fixture tags. If null is provided, all fixtures will be matched.

Clears the entire fixture and removes all animations. After this method is called, the LED strand will be blank.

### blank

**Parameters**

- `fixture` - Fixture filter parameters. Can be a numeric fixture offset, a string based fixture ID, or an array of fixture tags. If null is provided, all fixtures will be matched.

Blanks the entire LED strand. This method, unlike `clear`, will *not* remove any animations-- it will only clear the pixel buffer. If any animations are active, they will still render on the next cycle.

### getAnimations

**Parameters**

- `fixture` - Fixture filter parameters. Can be a numeric fixture offset, a string based fixture ID, or an array of fixture tags. If null is provided, all fixtures will be matched.

Retrieve a list of all animations currently active on the LED strand.

### getAnimation

**Parameters**

- `fixture` - Fixture filter parameters. Can be a numeric fixture offset, a string based fixture ID, or an array of fixture tags. If null is provided, all fixtures will be matched.
- `id` - Identifier of the animation to retrieve information for.

Retrieves the animation specified, including any configuration options.

### moveAnimation

**Parameters**

- `fixture` - Fixture filter parameters. Can be a numeric fixture offset, a string based fixture ID, or an array of fixture tags. If null is provided, all fixtures will be matched.
- `id` - Identifier of the animation to move.
- `index` - Index to move the animation to. All subsequent animations will be shifted down in the render order.

Move the specified animation to a new position in the render order.

### deleteAnimation

**Parameters**

- `fixture` - Fixture filter parameters. Can be a numeric fixture offset, a string based fixture ID, or an array of fixture tags. If null is provided, all fixtures will be matched.
- `id` - Identifier of the animation to delete.

Deletes the specified animation. This will not clear any LEDs modified by the animation.

### deleteAnimations

**Parameters**

- `fixture` - Fixture filter parameters. Can be a numeric fixture offset, a string based fixture ID, or an array of fixture tags. If null is provided, all fixtures will be matched.

Deletes all animations. This will not clear any LEDs modified by the animations.

### getAvailableAnimations

**Parameters**

*None*

Retrieves an array of available animations.

**Sample response**

```
[
	{
		"id": "color-fill",
		"name": "Color Fill",
		
		"options": {
			"color": {
				"type": "color",
				"name": "Color"
			}
		}
	},
	
	{
		"id": "music-visualizer",
		"name": "Music Visualizer",
		
		"options": {
			"excitement": {
				"type": "ranger",
				"min": 0,
				"max": 1,
				"step": 0.1,
				"name": "Excitement"
			}
		},
		
		"notifications": [
			"beat",
			"kick",
			"snare"
		]
	}
]
```

### notify

**Parameters**

- `fixture` - Fixture filter parameters. Can be a numeric fixture offset, a string based fixture ID, or an array of fixture tags. If null is provided, all fixtures will be matched.
- `animation` - ID of the animation to receive the notification
- `name` - String containing the name of the notification
- `payload` - Payload of a variable type for the  (Number, String, Array, or Object)

Notifies an animation of an event. For example, the music vizualizer may use the notification service to receive beat, kick, and snare events from another host running audio processing software.