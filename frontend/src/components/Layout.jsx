import Header from './Header/Header';

function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <main className="content">{children}</main>
    </div>
  );
}

export default Layout;