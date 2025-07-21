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
import chatrecapRouter from './core/chatrecap/chatrecap.router.js';
import pageRouter from './core/page/page.router.js';
import locationRouter from './core/location/location.router.js';
import curiculumstructureRouter from './core/curiculumstructure/curiculumstructure.router.js';
import curiculumRouter from './core/curiculum/curiculum.router.js';
import curiculumStructureDetailRouter from './core/curiculumstructuredetail/curiculumstructuredetail.router.js'
import curiculumDetail from './core/curiculumdetail/curiculumdetail.router.js'
import whatsappRouter from './core/whatsapp/whatsapp.router.js';
import membercourseRouter from './core/membercourse/membercourse.router.js';

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
        path: '/chat-recap',
        route: chatrecapRouter
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
        path: '/ref/location',
        route: locationRouter
    },
    {
        path: '/ref/curiculum-structure',
        route: curiculumstructureRouter
    },
    {
        path: '/ref/detail-structure',
        route: curiculumStructureDetailRouter
    },
    {
        path: '/ref/curiculum',
        route: curiculumRouter
    },
    {
        path: '/ref/curiculum-detail',
        route: curiculumDetail
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
        path: '/ref/page',
        route: pageRouter
    },
    {
        path: '/training/schedule',
        route: trainingscheduleRouter
    },
    {
        path: '/training/enrollment',
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
        path: '/membercourse',
        route: membercourseRouter
    },
    {
        path: '/memberattendance',
        route: memberattendanceRouter
    },
    {
        path: '/member-certificate',
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
    {
        path: '/whatsapp',
        route: whatsappRouter
    },
];

routeLists.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
