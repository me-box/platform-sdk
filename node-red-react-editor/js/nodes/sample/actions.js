import React, { Component, PropTypes } from 'react';

import { TEST_ACTION } from '../../constants/ActionTypes';

export function testAction(){
  return {
    type: TEST_ACTION,
  }
}