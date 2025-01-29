import './assets/styles/App.scss'
import Header from '@components/Header/Header';
import Footer from '@components/Footer/Footer';

export function App() {

  return (
    <div className="app">
      <Header/>
      <main className="main">
        <p> HelloWorld</p>
      </main>    
     <Footer />
    </div>
);
}