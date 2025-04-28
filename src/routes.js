import express from 'express';
import authenticationRouter from './core/authentication/authentication.router.js';
import landingpageRouter from './core/landingpage/landingpage.router.js';
import chatRouter from './core/chat/chat.router.js';
import examRouter from './core/ref/exam/exam.router.js';
import materialRouter from './core/ref/material/material.router.js';
import roleRouter from './core/ref/role/role.router.js';
import trainingRouter from './core/ref/training/training.router.js';
import transactionRouter from './core/ref/transaction/transaction.router.js';
import userRouter from './core/ref/user/user.router.js';
import memberRouter from './core/student/member/member.router.js';
import memberattendanceRouter from './core/student/memberattendance/memberattendance.router.js';
import membercertificateRouter from './core/student/membercertificate/membercertificate.router.js';
import memberidentityRouter from './core/student/memberidentity/memberidentity.router.js';
import memberparentRouter from './core/student/memberparent/memberparent.router.js';
import membersalaryRouter from './core/student/membersalary/membersalary.router.js';
import membertestRouter from './core/student/membertest/membertest.router.js';
import membertransactionRouter from './core/student/membertransaction/membertransaction.router.js';
import memberworkRouter from './core/student/memberwork/memberwork.router.js';

import paymentRouter from './core/payment/payment.router.js';
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
        path: '/ref/transaction',
        route: transactionRouter
    },
    {
        path: '/ref/user',
        route: userRouter
    },
    {
        path: '/student/member',
        route: memberRouter
    },
    {
        path: '/student/memberattendance',
        route: memberattendanceRouter
    },
    {
        path: '/student/membercertificate',
        route: membercertificateRouter
    },
    {
        path: '/student/memberidentity',
        route: memberidentityRouter
    },
    {
        path: '/student/memberparent',
        route: memberparentRouter
    },
    {
        path: '/student/membersalary',
        route: membersalaryRouter
    },
    {
        path: '/student/membertest',
        route: membertestRouter
    },
    {
        path: '/student/membertransaction',
        route: membertransactionRouter
    },
    {
        path: '/student/memberwork',
        route: memberworkRouter
    },
];

routeLists.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
