# shippingForecast

## Overview
This is a really basic Alexa Skill that uses AWS EC2, S3 and Lambda with NodeJS to get the UK Met Office (MO) Shipping Forecast for inshore waters from the MO website and read it aloud.

### Status
This skill is currently live and can be enabled on Alexa. Simply ask "*Alexa open Shipping Forecast*".

## Requisites
If you want to try this out you'll need a few bits and pieces.
* Access to an Alexa device (e.g. Echo or simulator).
* An AWS account.
  * An EC2 instance.
    * A NodeJS and SAM local enabled development environment.
  * An S3 share.
  * An AWS Lambda function.
* An Amazon Developer account.
  * An Alexa skill.

## Lambda

### Installation

> Requires NodeJS environment to be installed (version 6.10).

a) Clone the repository onto your EC2 instance from GitHub.

b) Change to the lambda directory.

`cd lambda`

c) Install the NodeJS modules.

`npm install`

### Testing

> Requires SAM local to be installed.

a) Change to the lambda directory.

`cd lambda`

b) Use the SAM local testing script provided to confirm the output of the skill _LaunchRequest_.

`./sam-local.sh`

### Deployment

>
> Requires an existing Lambda function (e.g. myLambdaFunction).
>

a) Change to the lambda directory.

`cd lambda`

b) Create a zip file with the name of your Lambda function.

`zip -qru ../<myLambdaFunction>.zip *`

c) Upload the zip file to your S3 share (an authorised user is required).

`aws s3 cp --profile <myDeploymentUser> <myLambdaFunction>.zip s3://<myPath>/`

d) To manually update, paste the S3 URL into the Lambda function and save.

`https://s3-<myLocation>.amazonaws.com/<myPath>/<myLambdaFunction>.zip`
