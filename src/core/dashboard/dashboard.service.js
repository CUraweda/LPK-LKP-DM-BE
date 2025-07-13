import BaseService from '../../base/service.base.js';
import prisma from '../../config/prisma.db.js';

class dashboardService extends BaseService {
	constructor() {
		super(prisma);
	}

	findAll = async (query) => {
		const q = this.transformBrowseQuery(query);
		delete q.take;
		delete q.skip;
		const data = await this.db.dashboard.findMany({ ...q });
		return data;
	};

	findById = async (id) => {
		const data = await this.db.dashboard.findUnique({ where: { id } });
		return data;
	};

	findArrange = async (id) => {
		const data = await this.db.dashboard.findMany({
			orderBy: { sectionID: 'asc' },
		});
		return data;
	};

	create = async (payload) => {
		const sectionNumber = await this.db.dashboard.count({
			where: { sectionID: payload.sectionID },
		});
		if (sectionNumber > 0)
			payload['uid'] = `${payload.sectionID}_${sectionNumber + 1}`;
		if (sectionNumber == 0) {
			payload['uid'] = `${payload.sectionID}_${sectionNumber + 1}`;
			payload['isTitle'] = true;
		}
		const data = await this.db.dashboard.create({ data: payload });
		return data;
	};

	update = async (id, payload) => {
		const previousData = await this.db.dashboard.findFirst({
			where: { id },
		});
		if (payload.sectionID != previousData.sectionID) {
			const sectionNumber = await this.db.dashboard.count({
				where: { sectionID: payload.sectionID },
			});
			if (sectionNumber > 0)
				payload['uid'] = `${payload.sectionID}_${sectionNumber + 1}`;
			if (sectionNumber == 0) {
				payload['uid'] = `${payload.sectionID}_${sectionNumber + 1}`;
				payload['isTitle'] = true;
			}
		}
		const data = await this.db.dashboard.update({
			where: { id },
			data: payload,
		});
		return data;
	};

	delete = async (id) => {
		const data = await this.db.dashboard.delete({ where: { id } });
		return data;
	};
}

export default dashboardService;
