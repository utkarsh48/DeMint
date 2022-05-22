import { Form, Button, Row, Col } from 'react-bootstrap';

const Minter = (props) => {
  const {
    onChange: handleChange,
    formOptions,
    onMintPress: handleMintPressed,
  } = props;

  return (
    <div className="bg-white shadow-sm p-4 rounded-2 h-100">
      <h1 className="text-center mb-5" id="title">
        Mint
      </h1>
      <Form onSubmit={handleMintPressed}>
        <Row>
          <Col
            sm={2}
            className="mb-3 d-flex flex-column justify-content-center"
          >
            <Form.Check
              name="uploadType"
              value="url"
              onChange={handleChange}
              checked={formOptions.uploadType === 'url'}
              type="radio"
              label="URL"
            />
            <Form.Check
              name="uploadType"
              value="file"
              onChange={handleChange}
              checked={formOptions.uploadType === 'file'}
              type="radio"
              label="File"
            />
          </Col>

          <Col className="mb-3">
            {formOptions.uploadType === 'file' && (
              <>
                <Form.Label>Upload File</Form.Label>
                <Form.Control
                  required
                  type="file"
                  name="asset"
                  onChange={handleChange}
                />
              </>
            )}

            {formOptions.uploadType === 'url' && (
              <>
                <Form.Label>Link to Asset</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="asset"
                  placeholder="e.g. https://gateway.pinata.cloud/ipfs/<hash>"
                  onChange={handleChange}
                />
              </>
            )}
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            required
            type="text"
            name="name"
            placeholder="e.g. My first NFT!"
            onChange={handleChange}
            value={formOptions.name}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            required
            type="text"
            name="description"
            placeholder="e.g. Description for NFT"
            value={formOptions.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Mint NFT
        </Button>
      </Form>
    </div>
  );
};

export default Minter;
