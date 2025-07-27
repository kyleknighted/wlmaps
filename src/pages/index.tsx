import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

const Home: React.FC = () => {
  return (<Map />);
};

export default Home;
