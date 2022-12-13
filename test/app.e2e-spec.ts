import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as pactum from "pactum";
import { PrismaService } from "../src/prisma/prisma.service";
import { AppModule } from "../src/app.module";
import { AuthDto } from "../src/auth/dto";

describe("App End2End Testing", () => {

  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
    }));
    await app.init(); 
    await app.listen(3004)

    prisma = app.get(PrismaService);
    await prisma.cleanDB();
    pactum.request.setBaseUrl("http://localhost:3004")
  });

  afterAll(() => {
    app.close()
  });

  describe("Authentication", () => {
    const dto: AuthDto = {
      email: "SigningUpFirstUser@gmail.com",
      password: "12345"
    }

    describe("Signup", () => {

      it("should throw an error if the email field remains empty", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({
            email: dto.email
          })
          .expectStatus(400)
          
      })

      it("should throw an error if the password field remains empty", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({
            password: dto.password
          })
          .expectStatus(400)
          
      })

      it("should throw an error if no body is provided", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .expectStatus(400)
          
      })

      it("User Should Signup", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody(dto)
          .expectStatus(201)
          
      });
    });

    describe("Signin", () => {

      it("should throw an error if the email field remains empty", () => {
        return pactum
          .spec()
          .post("/auth/signin")
          .withBody({
            email: dto.email
          })
          .expectStatus(400)
          
      })

      it("should throw an error if the password field remains empty", () => {
        return pactum
          .spec()
          .post("/auth/signin")
          .withBody({
            password: dto.password
          })
          .expectStatus(400)
          
      })

      it("should throw an error if no body is provided", () => {
        return pactum
          .spec()
          .post("/auth/signin")
          .expectStatus(400)
          
      })

      it("User Should Signin", () => {
        return pactum
          .spec()
          .post("/auth/signin")
          .withBody(dto)
          .expectStatus(200)
          .stores("userAccessToken", "access_token")
          
      })
    });

  });

  describe("User", () => {
    describe("Get me", () => {
      it("should retrieve the current user", () => {
        return pactum
          .spec()
          .post("/auth/signin")
          .expectStatus(200)
          .stores("userAccessToken", "access_token")

      })
    });
    describe("Edit user", () => {});
  });

  describe("Bookmarks", () => {
    describe("Create Bookmarks", () => {});
    describe("Get Bookmarks", () => {});
    describe("Get Bookmark by id", () => {});
    describe("Edit Bookmark", () => {});
    describe("Delete Bookmark", () => {});
  });

});