import './App.css';
import Audio from './component/audio';
import BackgroundAnimation, { varColor2x } from './component/background';
import { CssBaseline } from '@mui/material';
import Particle from './component/particle';

function App() {
  return (
    <>
      <CssBaseline />
     
      <Audio />
      <Particle>
        <BackgroundAnimation variant={varColor2x} />
        <h1>Hello</h1>
      </Particle>
    </>
  );
}

export default App;
