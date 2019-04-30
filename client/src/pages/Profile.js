import React, { Component } from 'react'
import withAuth from './../components/withAuth'
import API from './../utils/API'
import imagesAPI from './../utils/imagesAPI'
import { Link } from 'react-router-dom'

function ImageFilePreview({ src }) {
  return (
    <div className="pt-3" style={{ maxWidth: '200px' }}>
    <h3>Preview:</h3>
      <img className="img-fluid" src={src} alt="to upload" />
    </div>
  )
}

class Profile extends Component {
  state = {
    username: '',
    email: '',
    fileName: '',
    imageURI: null
  }

  fileInput = React.createRef()

  // this function gets the file chosen by the user and
  // calls our helper for uploading the image to images api
  handleSubmit = () => {
    const file = this.fileInput.current.files[0]

    // build form data object to send to server
    const data = new FormData()
    data.append('image', file)

    // send request to upload the file
    imagesAPI.uploadImage(data)
  }

  handleFileUploadComplete = res => {
    console.log(res)
  }

  handleFileUploadFail = error => {
    console.log(error)
  }

  // display a preview of the file selected by the user
  handleFileInputChange = () => {
    const file = this.fileInput.current.files[0]
    const reader = new FileReader()
    reader.onload = ({ target }) => {
      this.setState({ imageURI: target.result, fileName: file.name })
    }
    reader.readAsDataURL(file)
  }

  componentDidMount() {
    API.getUser(this.props.user.id).then(res => {
      this.setState({
        username: res.data.username,
        email: res.data.email
      })
    })
  }

  render() {
    return (
      <div className="container Profile">
        <h1>On the profile page!</h1>
        <p>Username: {this.state.username}</p>
        <p>Email: {this.state.email}</p>
        <Link to="/">Go home</Link>

        {/* image upload control and a preview of the chosen image */}
        <hr />
        <h2>Profile Image</h2>
        <div className="custom-file">
          <input
            ref={this.fileInput}
            type="file"
            className="custom-file-input"
            id="customFile"
            onChange={this.handleFileInputChange}
          />
          <label className="custom-file-label" htmlFor="customFile">
            {this.state.fileName || 'Choose file'}
          </label>
        </div>
        <div className="pt-3">
          <button
            type="submit"
            className="btn btn-outline-primary btn-block pt-2"
            onClick={this.handleSubmit}
          >
            Submit
          </button>
        </div>
        {this.state.imageURI ? (
          <ImageFilePreview src={this.state.imageURI} />
        ) : null}
      </div>
    )
  }
}

export default withAuth(Profile)
