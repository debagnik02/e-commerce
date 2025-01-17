import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center py-3">
            <p>DevShopper &copy; {year}</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
