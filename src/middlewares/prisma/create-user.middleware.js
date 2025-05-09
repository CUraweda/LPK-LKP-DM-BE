import memberService from "../../core/member/member.service.js";

const createUserMember = async ({ args, query }) => {
    const memberDService = new memberService()
    const memberData = await memberDService.create({})

    args.data['memberId'] = memberData.id
    const result = await query({
        ...args, include: {
            member: true
        }
    });

    return result;
};

export { createUserMember };
