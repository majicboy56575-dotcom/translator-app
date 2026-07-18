import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OnboardingScreen from './screens/OnboardingScreen';
import CameraScreen from './screens/CameraScreen';
import ResultScreen from './screens/ResultScreen';

function App() {
  return (
    <Routes>
      <Route path="/" element={<OnboardingScreen />} />
      <Route path="/camera" element={<CameraScreen />} />
      <Route path="/result" element={<ResultScreen />} />
    </Routes>
  );
}

export default App;
