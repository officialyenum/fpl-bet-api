import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { AuthDto, RegisterDto } from '../src/auth/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);
    await prisma.cleanDB();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(async () => {
    await prisma.cleanLastUser();
    app.close();
  });
  it.todo('testing 1');

  describe('Role', () => {
    describe('Create Role', () => {
      it.todo('should create role');
    });
    describe('Get Roles', () => {
      it.todo('should get roles');
    });
    describe('Get Role', () => {
      it.todo('should get one role');
    });
  });
  describe('Auth', () => {
    const registerDto: RegisterDto = {
      userName: 'yenum',
      email: 'test@test.com',
      password: 'password',
    };
    const authDto: AuthDto = {
      email: 'test@test.com',
      password: 'password',
    };
    describe('Register User', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            password: registerDto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: registerDto.email,
          })
          .expectStatus(400);
      });
      it('should throw if username  taken', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            userName: 'admin',
            email: 'testUser@fplstake.com',
            password: registerDto.password,
          })
          .expectStatus(403);
      });
      it('should throw if email is  taken', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: 'admin@fplstake.com',
            password: registerDto.password,
          })
          .expectStatus(400);
      });
      it('register user', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody(registerDto)
          .expectStatus(201);
      });
    });
    describe('Login User', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            password: authDto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: authDto.email,
          })
          .expectStatus(400);
      });
      it('should throw if email not found', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: 'kak@fplstake.com',
            password: authDto.password,
          })
          .expectStatus(404);
      });
      it('should throw if password is not incorrect', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: authDto.email,
            password: 'IncorrectPass',
          })
          .expectStatus(403);
      });
      it('Logged in Successfully', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(authDto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });
  describe('User', () => {
    describe('Get Me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .inspect();
      });
    });
    describe('Update Me', () => {
      it.todo('Update My Profile');
    });
  });
  describe('GameType', () => {
    describe('Create Game Type', () => {
      it.todo('getting roles');
    });
    describe('Get Game Type', () => {
      it.todo('getting roles');
    });
    describe('Get Game Types', () => {
      it.todo('getting roles');
    });
  });
  describe('Game', () => {
    describe('Create Game', () => {
      it.todo('getting roles');
    });
    describe('Get Games', () => {
      it.todo('getting games');
    });
    describe('Get Game By Id', () => {
      it.todo('getting game');
    });
    describe('Get Game(s) i created', () => {
      it.todo('getting game');
    });
    describe('Get Game(s) i joined', () => {
      it.todo('getting game');
    });
  });
  describe('GameRecord', () => {
    describe('Get Game Record By ID', () => {
      it.todo('getting roles');
    });
    describe('Get Game Record(s) By Game ID', () => {
      it.todo('getting roles');
    });
  });
  describe('Bet', () => {
    describe('Get My Bets', () => {
      it.todo('getting roles');
    });
  });
});
