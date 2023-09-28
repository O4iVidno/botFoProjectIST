import { HearManager } from '@vk-io/hear';
import mongoose from 'mongoose';
import { getRandomId, VK, API, Upload, Keyboard, CollectError } from 'vk-io';

//connetc to mongo
export const connectToMongo = async () => {
	await mongoose.connect('mongodb://localhost:27017/users');
   
	const db = mongoose.connection;
   
	db.on('error', console.error.bind(console, 'MongoDB connection error:'));
};
   
export const models = {
	User: mongoose.model('User', {
		user_id: Number,
		first_name: String,
		last_name: String,
		team_id: Number,
	}),
	Team: mongoose.model('Team', {
		team_id: Number,
		points: Number,
	}),
};

const Token =
	'vk1.a.Q2jkowr0mRALssUUhT9OEPmSF4P9ptDlJ0pZyVEXO_HvelnHspFZ2RgPjIcLwNGNJJJtzZHCSluCD9OFZFqEJ-djJTQ61jW1Avp_1nYfYj3NPWgo-gliYrs7mb9EI2m7i_1p1_3tkYnqtHFR2GNTeFTGkI47eTn77OP8yBNqxBwtf8oYQThh5nL4ejq_fhxitow2SC-Euf9500zFXjsT2g';
const command = new HearManager();

const api = new API({
	token: Token,
});

const upload = new Upload({
	api: api,
});

const vk = new VK({
	token: Token,
	apiVersion: '5.154',
});

const attachment = await upload.messagePhoto({
	source: {
		value: './2.jpg',
	},
});

vk.updates.on('message_new', command.middleware);

const regUser = async (user, msg) => {
	const userId = user.id;
   
	const isUserReg = await models.User.findOne({ user_id: userId });
   
	if (isUserReg) {
	 vk.api.messages.send({
	  message: 'Already registred',
	  peer_id: msg.peerId,
	  random_id: getRandomId(),
	 });
   
	 console.log(`user id: ${user.id} is already reg`);
	} else {
	 // --------------------- ЧТО ТУТ НАХУЙ ПРОИСХОДИТ ---------------------
	 // const teamId = (await models.Team.find()).length;
	 // if (!teamId) models.Team.create({ team_id: 0, points: 0 });
   
	 // const countUsers = (await models.User.find({team_id: teamId})).length;
	 // if (countUsers > 😍
	 //  models.Team.create({ team_id: teamId + 1, points: 0 });
   
	 // console.log(countUsers, teamId);
   
	//  console.log(currentTeam);
   
	 //create new user
	 const newUser = new models.User({
	  user_id: user.id,
	  first_name: user.first_name,
	  last_name: user.last_name,
	  team_id: 1,
	 });
	 const newUTeam = new models.Team({
		team_id: 1,
		points: 0,
	});
	 await models.User.create(newUser);
   
	 // ---- not work ------
	//  currentTeam == 4 ? currentTeam = 0 : currentTeam++;
	//  console.log(currentTeam);
	 //---------------------
   
	 vk.api.messages.send({
	  message: 'U a registred now',
	  peer_id: msg.peerId,
	  random_id: getRandomId(),
	 });
   
	 console.log(`user id: ${user.id} is registred now`);
	 console.log(await models.User.findOne(newUser));
	}
   };

command.hear(/^Старт$/i, async (msg) => {
	const [user] = await vk.api.users.get({
		user_id: msg.senderId,
	})
	await regUser(user, msg);
	vk.api.messages.send({
		message: 'Мяу',
		attachment: attachment,
		peer_id: msg.senderId,
		random_id: getRandomId(),
	});
});

const menuAdmin = async (msg) => {
	let keyboard = Keyboard.keyboard([
		[
			Keyboard.textButton({
				label: 'Команда пришла',
				color: 'secondary',
				payload: { cmd: 'showList' },
			}),
	]]);
	await msg.send({
		message: 'Выберите действие:',
		keyboard: keyboard,
		random_id: getRandomId(),
	});
};

const listTeam = async (msg) => {
	let keyboard = Keyboard.keyboard([
		[
			Keyboard.textButton({
				label: '#1',
				color: 'secondary',
				payload: { 
					cmd: 'rating',
					team_id: 1,

			 },
			}),
			Keyboard.textButton({
				label: '#2',
				color: 'secondary',
				payload: { cmd: 'rating',
					team_id: 2,
				 },
			}),
			Keyboard.textButton({
				label: '#3',
				color: 'secondary',
				payload: { cmd: 'rating',
					team_id: 3,
				 },
			}),
			Keyboard.textButton({
				label: '#4',
				color: 'secondary',
				payload: { cmd: 'rating',
					team_id: 4,
				 },
			}),
			Keyboard.textButton({
				label: '#5',
				color: 'secondary',
				payload: { cmd: 'rating',
					team_id: 5,
				 },
			}),
		],
		[
			Keyboard.textButton({
				label: '#6',
				color: 'secondary',
				payload: { cmd: 'rating',
					team_id: 6,
				 },
			}),
			Keyboard.textButton({
				label: '#7',
				color: 'secondary',
				payload: { cmd: 'rating',
					team_id: 7,
				 },
			}),
			Keyboard.textButton({
				label: '#8',
				color: 'secondary',
				payload: { cmd: 'rating',
					team_id: 8,
				 },
			}),
			Keyboard.textButton({
				label: '#9',
				color: 'secondary',
				payload: { cmd: 'rating',
					team_id: 9,
				 },
			}),
			Keyboard.textButton({
				label: '#10',
				color: 'secondary',
				payload: { cmd: 'rating',
					team_id: 10,
				 },
			}),
		],
		// [
		// 	Keyboard.textButton({
		// 		label: 'Back',
		// 		color: 'primary',
		// 		payload: { cmd: 'backToMenu' },
		// 	}),
		// ],
	]);
	msg.send({
		message: 'Выберите команду:',
		keyboard: keyboard,
		random_id: getRandomId(),
	});
};

const menuRating = async (msg, team_id) => {
	let keyboard = Keyboard.keyboard([
		[
			Keyboard.textButton({
				label: '#1',
				color: 'secondary',
				payload: { 
					cmd: 'checkDura',
					team_id: team_id,
					points: 1, 
				},
			}),
			Keyboard.textButton({
				label: '#2',
				color: 'secondary',
				payload: { 
					cmd: 'checkDura',
					team_id: team_id,
					points: 2, 
				},
			}),
			Keyboard.textButton({
				label: '#3',
				color: 'secondary',
				payload: { 
					cmd: 'checkDura',
					team_id: team_id,
					points: 3,
				},
			}),
			Keyboard.textButton({
				label: '#4',
				color: 'secondary',
				payload: { 
					cmd: 'checkDura',
					team_id: team_id,
					points: 4, 
				},
			}),
			Keyboard.textButton({
				label: '#5',
				color: 'secondary',
				payload: { 
					cmd: 'checkDura',
					team_id: team_id,
					points: 5, 
				},
			}),
		],
		[
			Keyboard.textButton({
				label: 'Back',
				color: 'primary',
				payload: { cmd: 'backToMainMenu' },
			}),
		],
	]);
	await msg.send({
		message: 'Какое количество баллов начислить?',
		keyboard: keyboard,
		random_id: getRandomId(),
	});
};


const check = async (msg, team_id, points) => {
	let keyboard = Keyboard.keyboard([
		[
			Keyboard.textButton({
				label: 'Подтвердить',
				color: 'positive',
				payload: { 
					cmd: 'addPoints',
					team_id: team_id,
					points: points, 
				},
			})
	],[
		Keyboard.textButton({
			label: 'Назад',
			color: 'primary',
			payload: { cmd: 'backMenu' },
		})
	]]);
	await msg.send({
		message: 'Выберите действие:',
		keyboard: keyboard,
		random_id: getRandomId(),
	});
};

command.hear(/^Машина дура$/i, async (msg) => {
	await menuAdmin(msg);
});

vk.updates.on('message', async (msg, next) => {
	const cmd = msg.messagePayload?.cmd;

	switch (cmd) {
		case 'showList':
			await listTeam(msg);
			break;
		case 'backToMainMenu':
			await menuAdmin(msg);
			break;
		case 'backMenu':
			await menuRating(msg);
			break;
		case 'rating':
			let team_id = msg.messagePayload.team_id
			await menuRating(msg, team_id);
			break;
		case 'checkDura':
			team_id = msg.messagePayload.team_id
			let points = msg.messagePayload.points
			await check(msg, team_id, points);

			break;
		case 'addPoints':
			team_id = msg.messagePayload.team_id
			points = msg.messagePayload.points
			// let oldPoint = await models.Team.findOne({team_id:team_id})
			// console.log(oldPoint);
			// await models.Team.findOneAndUpdate(points);
			break;
		default:
			break;
	}
});

await connectToMongo();

vk.updates.startPolling().catch((err) => {
	console.error(err);
});
