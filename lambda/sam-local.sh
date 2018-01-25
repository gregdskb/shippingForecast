#!/bin/bash
# 
# Quick script to call the sam local string.
#
sam local invoke \
AlexaSkillFunction \
--template sam-local.yaml \
--event sam-local.json
