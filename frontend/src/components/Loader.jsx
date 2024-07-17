import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <Spinner
      animation='border'
      role='status'
      style={{
        width:'88px',
        height:'88px',
        margin:'auto',
        display:'block',
      }}
    ></Spinner>
  );
};  export default Loader;
