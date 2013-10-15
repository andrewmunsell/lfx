# LFX

System for managing and controlling strands of LEDs. The system is controllable over a network with a TCP/HTTP JSON-RPC API as well as a HTTP web interface.

*Note: The following API documentation is under development and is not complete. Additionally, not all API functionality listed here is functional.*

## Installation

LFX requires Node.js v0.10.20 or higher. 

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
--daemon, -d  Start the process as a daemon. Only useful if the HTTP server is enabled as well.  [default: false]
```

## Configuration

A JSON configuration file may be specified to alter LFX's default HTTP and TCP servers, as well as configure other options such as the number of LEDs.

A sample configuration file is below with the default values.

```
{
	"leds": 25,
	
	"http.server": false,
	"http.port": 80,

	"tcp.server": true,
	"tcp.address": "0.0.0.0", // Address to bind to
	"tcp.port": 9123
}
```

The configuration file may be specified with the `-config, -c` command line flag:

```
node src/index.js -c config.json
```

## JSON-RPC API

The API is JSON-RPC 2.0 compliant and has several methods for managing the raw pixel data, as well as animations. It can be accessed over a TCP socket or over HTTP.

To use the TCP API, connect to the IP address or hostname and port of the LFX server and send any of the following methods over the TCP socket.

To use the HTTP API, a `POST` request must be sent to the API endpoint, `/api`, with the body containing a valid JSON-RPC command.

### set

**Parameters**

- `offset` - LED to set. 0 index based, where 0 is the LED physically closest to the controller.
- `r` - Red value from 0 to 255
- `g` - Green value from 0 to 255
- `b` - Blue value from 0 to 255

Sets the individual LED at `offset` to the specified RGB color. If an animation is currently running and renders to this LED, it will overwrite this value during the next render cycle. Otherwise, this LED will stay lit until another `set` is called on this LED, the LED strand is cleared, or an animation renders onto this LED.

### setHSL

**Parameters**

- `offset` - LED to set. 0 index based, where 0 is the LED physically closest to the controller.
- `h` - Hue value from 0 to 255
- `s` - Saturation value from 0 to 255
- `l` - Lightness value from 0 to 255

Sets the individual LED at `offset` to the specified HSL value. Behavior is similar to the `set` method.


### clear

**Parameters**

*None*

Clears the entire strand and all animations. After this method is called, the LED strand will be blank.

### blank

**Parameters**

*None*

Blanks the entire LED strand. This method, unlike `clear`, will *not* remove any animations-- it will only clear the pixel buffer. If any animations are active, they will still render on the next cycle.

### getAnimations

**Parameters**

*None*

Retrieve a list of all animations currently active on the LED strand.

### getAnimation

**Parameters**

- `id` - Identifier of the animation to retrieve information for.

Retrieves the animation specified, including any configuration options.

### deleteAnimation

**Parameters**

- `id` - Identifier of the animation to delete.

Deletes the specified animation. This will not clear any LEDs modified by the animation.

### deleteAnimations

**Parameters**

*None*

Deletes all animations. This will not clear any LEDs modified by the animations.