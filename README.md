# ImageCarouselReact
Author: Akileng Isaac, Flock of Birds

Type: Widget
Latest Version: 1.0
Package file name: ImageCarouselReact.mpk

## Description

Displays images in a carousel either from the database or from the modeler

## Typical usage scenario

* Displays Images in a carousel

## Features and limitations

* Static and dynamic images (From modeler or the database)
* Use Navigations controls to move images
* Auto Slide of images based on an Interval
* Onclick Event to Images to call Microflow or Open Page
* Height and Width configurations

## Installation

See the general instructions under _Configuration._

## Dependencies

* Mendix 6 Environment. Tested on 6.8.0


## Configuration
* Create an entity that inherits from the System.image 
  * Add String "Caption" attribute (Optional)
  * Add String "Description" attribute (Optional)

* For static Images, add the images directly to the widget from Source - Static Tab


## Properties
* Data Source
  * Entity;The entity with the images to display
  * Source;Type of Source could be Xpath, Microflow or Static
  * Caption;Based on attribe, caption shown on image
  * Description;Based on attribe, Description shown on image
* Source - Xpath
  * Constraint;Constraint to image entity
* Source - Microflow
  * Data Source Microflow;Returns images for carousel
* Source - Static
  * Images To Display
     - Data Source
        - Image Caption;caption shown on image
        - Image Description;Description shown on image
        - Image/Picture;image to display on carousel
     - Behaviour
        - On Click;what action to excute when image is clicked
        - Call Microflow; Microflow to execute when image is clicked
        - Open Page; Page to open when image is clicked
* Carousel
  * Use Image Navigation;Move to next image or back 
  * Indicators;index of image in the carousel shown by the dots
  * Interval;Duration of image transitions
  * Pause On Hover:Pause image transitions on hover
  * Slide Images;Move through images by sliding them
* Appearance
  * Width;width of the carousel
  * WidthUnits;Measurement for width percent,pixels or auto
  * Height;Height of the carousel
  * HeightUnits;Measurement for Height percent,pixels or auto
* Behaviour
  * On Click;what action to excute when image is clicked
  * Call Microflow;Microflow to execute when image is clicked
  * Open Page;Page to open when image is clicked

Source and [Sample project](https://github.com/akileng56/ImageCarouselReact/tree/master/test) at GitHub

Please contribute fixes and extensions at https://github.com/akileng56/ImageCarouselReact



## Known bugs

* None so far; please let me know when there are any issues or suggestions.
