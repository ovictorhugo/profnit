import { Route, useParams } from 'react-router-dom';
import { ResearcherPage } from '../components/ResearcherPage';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

function Researcher() {
  const { userId, term, type } = useParams<{
    userId: string;
    term: string | undefined; // Define term as string | undefined
    type: string;
  }>();

  console.log(term);

  return (
    <div>
      <div className=''>
        <Header />
      </div>
      <ResearcherPage id={userId || ''} term={term || ''} type={type || ''} />
      <Footer />
    </div>
  );
}

export default Researcher;
