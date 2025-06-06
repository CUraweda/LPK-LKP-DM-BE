import express from 'express';
import authenticationRouter from './core/authentication/authentication.router.js';
import landingpageRouter from './core/landingpage/landingpage.router.js';
import chatRouter from './core/chat/chat.router.js';
import examRouter from './core/exam/exam.router.js';
import materialRouter from './core/material/material.router.js';
import roleRouter from './core/role/role.router.js';
import trainingRouter from './core/training/training.router.js';
import transactionRouter from './core/transaction/transaction.router.js';
import userRouter from './core/user/user.router.js';
import memberRouter from './core/member/member.router.js';
import memberattendanceRouter from './core/memberattendance/memberattendance.router.js';
import membercertificateRouter from './core/membercertificate/membercertificate.router.js';
import memberidentityRouter from './core/memberidentity/memberidentity.router.js';
import memberparentRouter from './core/memberparent/memberparent.router.js';
import membersalaryRouter from './core/membersalary/membersalary.router.js';
import membertestRouter from './core/membertest/membertest.router.js';
import membertransactionRouter from './core/membertransaction/membertransaction.router.js';
import memberworkRouter from './core/memberwork/memberwork.router.js';
import paymentRouter from './core/payment/payment.router.js';
import trainingscheduleRouter from './core/trainingschedule/trainingschedule.router.js';
import trainingenrollmentRouter from './core/trainingenrollment/trainingenrollment.router.js';
import dashboardRouter from './core/dashboard/dashboard.router.js';
import trainingcategoryRouter from './core/trainingcategory/trainingcategory.router.js'

const router = express.Router();

export const routeLists = [
    {
        path: '/auth',
        route: authenticationRouter
    },
    {
        path: '/cms/config',
        route: landingpageRouter
    },
    {
        path: '/payment',
        route: paymentRouter
    },
    {
        path: '/chat',
        route: chatRouter
    },
    {
        path: '/ref/exam',
        route: examRouter
    },
    {
        path: '/ref/material',
        route: materialRouter
    },
    {
        path: '/ref/role',
        route: roleRouter
    },
    {
        path: '/ref/training',
        route: trainingRouter
    },
    {
        path: '/ref/dashboard',
        route: dashboardRouter
    },
    {
        path: '/training/schedule',
        route: trainingscheduleRouter
    },
    {
        path: '/training',
        route: trainingenrollmentRouter
    },
    {
        path: '/ref/training-category',
        route: trainingcategoryRouter
    },
    {
        path: '/ref/transaction',
        route: transactionRouter
    },
    {
        path: '/ref/user',
        route: userRouter
    },
    {
        path: '/member',
        route: memberRouter
    },
    {
        path: '/memberattendance',
        route: memberattendanceRouter
    },
    {
        path: '/membercertificate',
        route: membercertificateRouter
    },
    {
        path: '/memberidentity',
        route: memberidentityRouter
    },
    {
        path: '/memberparent',
        route: memberparentRouter
    },
    {
        path: '/membersalary',
        route: membersalaryRouter
    },
    {
        path: '/membertest',
        route: membertestRouter
    },
    {
        path: '/membertransaction',
        route: membertransactionRouter
    },
    {
        path: '/memberwork',
        route: memberworkRouter
    },
];

routeLists.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
