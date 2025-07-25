import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

const Home: React.FC = () => {
  return (
    <div>
      <h1>Woodland Lakes Map</h1>
      <Map />
    </div>
  );
};

export default Home;
