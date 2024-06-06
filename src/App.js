import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

import MainMenu from "./components/MainMenu";
import GameRules from './components/GameRules';
import Game from './components/Game';

const router = createBrowserRouter([
  {
    path: '/',
    element:  <MainMenu/>,
  },
  {
    path: '/rules',
    element: <GameRules/>
  },
  {
    path: '/game',
    element: <Game/>
  }
])

function App() {
  return (
    <div className="App" role='main'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
