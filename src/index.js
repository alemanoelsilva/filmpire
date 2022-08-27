import ReactBom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './components/App';

ReactBom.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
);
