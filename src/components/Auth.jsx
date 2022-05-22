import { Button, Col, Container, Row } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { ReactComponent as MetaMaskImg } from '../assets/metamask.svg';
import nftImg from '../assets/simon-lee-U00xWfo5yJA-unsplash.jpg';
import { NO_WALLET } from "../constants/status";

const Auth = (props) => {

  const {walletAddress, connectWalletPressed, status} = props;

	if (walletAddress) return (<Navigate to='/' />);

	return (<div className="h-100 d-flex justify-content-center align-items-center p-1">
		<Container className="px-4 flex-1">
			<Row className="p-4">
				<Col md={{span: 4, offset: 2}}>
					<img className="w-100 rounded" src={nftImg} alt="nft" />
				</Col>
				<Col md={{span: 4}} className="d-flex justify-content-center align-items-center flex-column">
					<div style={{minWidth: '120px'}} className='w-75 my-2'>
						<MetaMaskImg />
					</div>
					{status === NO_WALLET ? <a rel="noreferrer" target="_blank" className="btn btn-primary" href="https://metamask.io">Download Metamask</a> : <Button onClick={connectWalletPressed}>Connect Wallet</Button>}
				</Col>
			</Row>
		</Container>
	</div>);
}

export default Auth;
