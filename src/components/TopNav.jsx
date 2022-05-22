import { Navbar, Container, Button, Badge } from "react-bootstrap/";

const truncateText = (text = "") => {
  return text.length > 10
    ? text.substring(0, 6) + "..." + text.substring(text.length - 3)
    : text;
};

const TopNav = (props) => {
  const { wAddress, connectWallet } = props;
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="#">DeMint</Navbar.Brand>
        {wAddress ? (
          <Badge
            bg="light"
            role="button"
            className="text-primary p-2 px-3 rounded"
            title={wAddress}
          >
            <span>{truncateText(wAddress)}</span>
          </Badge>
        ) : (
          <Button onClick={connectWallet}>Connect Wallet</Button>
        )}
      </Container>
    </Navbar>
  );
};

export default TopNav;
