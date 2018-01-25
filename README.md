# shippingForecast

## Overview
This is a really basic Alexa Skill that uses AWS EC2, S3 and Lambda with NodeJS to get the UK Met Office (MO) Shipping Forecast for inshore waters from the MO website and read it aloud.

### Status
This skill is currently live and can be enabled on Alexa. Simply ask "*Alexa open Shipping Forecast*".

## Requisites
If you want to try this out you'll need a few bits and pieces.
* Access to an Alexa device (e.g. Echo or simulator).
* An AWS account.
** An EC2 instance.
*** A NodeJS and SAM local enabled development environment.
** An S3 share.
* An Amazon Developer account.
** An Alexa skill.

## Lambda
### Installation
a) Obtain the repository.
b) Change to the lambda directory.
`cd lambda`
c) Install the NodeJS modules.
`npm install`
