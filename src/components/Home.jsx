import { ListGroup } from 'react-bootstrap';
import { decodeTransaction } from '../util/scan';

const Home = ({ transactions }) => {

  return (
    <div className="bg-white shadow-sm p-4 rounded-2 h-100">
      <h1 className="text-center mb-5" id="title">
        Your NFTs
      </h1>
      {transactions.length === 0 && (
        <div className="pt-5 text-secondary text-center">
          <h3>Nothing here</h3>
          <h6>Go mint some NFTs...</h6>
        </div>
      )}
      <ListGroup>
        {transactions.map((transaction) => (
          <ListGroup.Item key={transaction.hash}>
            <div className="text-truncate">
              <a
                href={decodeTransaction(transaction.input).params[1]['value']}
                className="fw-bold text-decoration-none"
                rel="noreferrer"
                target="_blank"
              >
                {transaction.hash}
              </a>
            </div>
            <div className="text-secondary fw-light">
              {new Date(
                parseInt(transaction.timeStamp.padEnd(13, 0))
              ).toLocaleDateString()}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Home;
