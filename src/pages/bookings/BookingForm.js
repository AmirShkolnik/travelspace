import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { axiosRes } from "../../api/axiosDefaults";
import styles from '../../styles/BookingForm.module.css';
import { useRedirect } from "../../hooks/useRedirect";
import { toast } from 'react-toastify';

const BookingForm = () => {
  useRedirect("loggedOut");
  const history = useHistory();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [courseId, setCourseId] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState({});

  const translateCourseName = (name) => {
    const courseNameMap = {
      'OW': 'Open Water',
      'AOW': 'Advanced Open Water',
      'RD': 'Rescue Diver'
    };
    return courseNameMap[name] || name;
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axiosRes.get('/diving-courses/');
        setCourses(data.results || data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        toast.error('Failed to fetch courses. Please try again.');
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    try {
      const formattedDate = new Date(date).toISOString().split('T')[0];
      const formattedTime = time + ':00';
  
      const { data } = await axiosRes.post('/bookings/', {
        date: formattedDate,
        time: formattedTime,
        course: parseInt(courseId),
        additional_info: additionalInfo  // Make sure this matches the backend field name
      });
      console.log('Booking created:', data);
      toast.success('Booking submitted successfully!');
      history.push('/bookings');
    } catch (err) {
      console.error('Error creating booking:', err);
      if (err.response && err.response.data) {
        setErrors(err.response.data);
        Object.values(err.response.data).forEach(error => {
          toast.error(Array.isArray(error) ? error[0] : error);
        });
      } else {
        setErrors({ message: 'An error occurred while creating the booking.' });
        toast.error('Failed to submit booking. Please try again.');
      }
    }
  };

  const isTenthOfMonth = (date) => {
    const selectedDate = new Date(date);
    return selectedDate.getDate() === 10;
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    if (isTenthOfMonth(selectedDate)) {
      setDate(selectedDate);
      setErrors((prevErrors) => ({ ...prevErrors, date: undefined }));
    } else {
      setErrors({ date: 'Bookings are only available on the 10th of each month.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.bookingForm}>
      <h2>Book a Diving Course</h2>
      {errors.message && <div className={styles.error}>{errors.message}</div>}
      <div>
        <label htmlFor="date">Date (10th of the month):</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={handleDateChange}
          required
        />
        {errors.date && <span className={styles.error}>{errors.date}</span>}
      </div>
      <div>
        <label htmlFor="time">Time (09:00 or 15:00):</label>
        <select
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        >
          <option value="">Select a time</option>
          <option value="09:00">09:00</option>
          <option value="15:00">15:00</option>
        </select>
        {errors.time && <span className={styles.error}>{errors.time}</span>}
      </div>
      <div>
        <label htmlFor="course">Diving Course:</label>
        <select
          id="course"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          required
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {translateCourseName(course.name)}
            </option>
          ))}
        </select>
        {errors.course && <span className={styles.error}>{errors.course}</span>}
      </div>
      <div>
        <label htmlFor="additionalInfo">Additional Information:</label>
        <textarea
          id="additionalInfo"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          rows="4"
        ></textarea>
      </div>
      <button className={styles.Button} type="submit">
        Book Now
      </button>
    </form>
  );
};

export default BookingForm;