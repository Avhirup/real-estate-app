import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import ProfileLoading from '../skeleton/ProfileLoading';

export default function Post() {
  return (
    <div className="container">
      <h1>Post</h1>
    </div>
  );
}
