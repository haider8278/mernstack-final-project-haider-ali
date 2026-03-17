require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');

const seed = async () => {
  try {
    await connectDB();

    // Clear existing data (order matters due to refs)
    await Enrollment.deleteMany({});
    await Lesson.deleteMany({});
    await Course.deleteMany({});
    await User.deleteMany({});

    const hashedPassword = await bcrypt.hash('password123', 10);

    // --- Users ---
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@lms.com',
      password: hashedPassword,
      role: 'admin',
    });

    const instructor1 = await User.create({
      name: 'Jane Instructor',
      email: 'jane@lms.com',
      password: hashedPassword,
      role: 'instructor',
    });

    const instructor2 = await User.create({
      name: 'John Teacher',
      email: 'john@lms.com',
      password: hashedPassword,
      role: 'instructor',
    });

    const student1 = await User.create({
      name: 'Alice Student',
      email: 'alice@lms.com',
      password: hashedPassword,
      role: 'student',
    });

    const student2 = await User.create({
      name: 'Bob Learner',
      email: 'bob@lms.com',
      password: hashedPassword,
      role: 'student',
    });

    const student3 = await User.create({
      name: 'Carol Trainee',
      email: 'carol@lms.com',
      password: hashedPassword,
      role: 'student',
    });

    console.log('Created users');

    // --- Courses ---
    const course1 = await Course.create({
      title: 'Introduction to React',
      description: 'Learn React from scratch: components, hooks, and state management.',
      instructor: instructor1._id,
      category: 'Web Development',
      price: 49.99,
    });

    const course2 = await Course.create({
      title: 'Node.js & Express Backend',
      description: 'Build REST APIs with Node.js, Express, and MongoDB.',
      instructor: instructor1._id,
      category: 'Backend',
      price: 59.99,
    });

    const course3 = await Course.create({
      title: 'MongoDB Fundamentals',
      description: 'NoSQL databases, Mongoose ODM, and data modeling.',
      instructor: instructor2._id,
      category: 'Database',
      price: 39.99,
    });

    const course4 = await Course.create({
      title: 'Full Stack MERN',
      description: 'Complete MERN stack: MongoDB, Express, React, Node.js.',
      instructor: instructor2._id,
      category: 'Web Development',
      price: 79.99,
    });

    console.log('Created courses');

    // --- Lessons ---
    const lessonData = [
      { title: 'What is React?', content: 'React is a JavaScript library...', course: course1._id, order: 1 },
      { title: 'Components & JSX', content: 'Building reusable components...', course: course1._id, order: 2 },
      { title: 'Hooks: useState & useEffect', content: 'Managing state and side effects...', course: course1._id, order: 3 },
      { title: 'Setting up Express', content: 'Initialize project and middleware...', course: course2._id, order: 1 },
      { title: 'REST API Routes', content: 'GET, POST, PUT, DELETE...', course: course2._id, order: 2 },
      { title: 'Connecting MongoDB', content: 'Mongoose connection and schemas...', course: course2._id, order: 3 },
      { title: 'Documents & Collections', content: 'CRUD operations in MongoDB...', course: course3._id, order: 1 },
      { title: 'Mongoose Schemas', content: 'Defining models and validation...', course: course3._id, order: 2 },
      { title: 'MERN Overview', content: 'Architecture and project setup...', course: course4._id, order: 1 },
      { title: 'Auth with JWT', content: 'Login, register, protected routes...', course: course4._id, order: 2 },
    ];

    await Lesson.insertMany(lessonData);
    console.log('Created lessons');

    // --- Enrollments ---
    await Enrollment.insertMany([
      { student: student1._id, course: course1._id, progress: 33 },
      { student: student1._id, course: course2._id, progress: 100 },
      { student: student1._id, course: course4._id, progress: 50 },
      { student: student2._id, course: course1._id, progress: 100 },
      { student: student2._id, course: course3._id, progress: 0 },
      { student: student3._id, course: course2._id, progress: 66 },
      { student: student3._id, course: course4._id, progress: 0 },
    ]);

    console.log('Created enrollments');
    console.log('\n--- Seed completed successfully ---');
    console.log('Users: 1 admin, 2 instructors, 3 students (password for all: password123)');
    console.log('Courses: 4 | Lessons: 10 | Enrollments: 7');
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

seed();
