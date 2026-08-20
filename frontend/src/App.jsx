import Layout from './components/Layout';
import Button from './components/Button';
import Toggle from './components/Toggle';

function App() {
  return (
    <Layout>
      <h1>Welcome</h1>
      <Button label="Click Me" onClick={() => alert("Clicked!")} />
      <Toggle />
    </Layout>
  );
}

export default App;