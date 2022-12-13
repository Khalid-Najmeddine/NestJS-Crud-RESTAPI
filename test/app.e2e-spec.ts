import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as pactum from "pactum";
import { PrismaService } from "../src/prisma/prisma.service";
import { AppModule } from "../src/app.module";
import { AuthDto } from "../src/auth/dto";
import { EditUserDto } from "../src/user/dto";
import { CreateBookmarkDto, EditBookmarkDto } from "../src/bookmark/dto";

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
          .withBody({email: dto.email})
          .expectStatus(400)
          // .inspect()
      })

      it("should throw an error if the password field remains empty", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({password: dto.password})
          .expectStatus(400)
          // .inspect()
      })

      it("should throw an error if no body is provided", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .expectStatus(400)
          // .inspect()
      })

      it("User Should Signup", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody(dto)
          .expectStatus(201)
          // .inspect()
      });
    });

    describe("Signin", () => {
      it("should throw an error if the email field remains empty", () => {
        return pactum
          .spec()
          .post("/auth/signin")
          .withBody({email: dto.email})
          .expectStatus(400)
          // .inspect()
      })

      it("should throw an error if the password field remains empty", () => {
        return pactum
          .spec()
          .post("/auth/signin")
          .withBody({password: dto.password})
          .expectStatus(400)
          // .inspect()
      })

      it("should throw an error if no body is provided", () => {
        return pactum
          .spec()
          .post("/auth/signin")
          .expectStatus(400)
          // .inspect()
      })

      it("User Should Signin", () => {
        return pactum
          .spec()
          .post("/auth/signin")
          .withBody(dto)
          .expectStatus(200)
          .stores("userAccessToken", "access_token")
          // .inspect()
      })
    });

  });

  describe("User", () => {
    describe("Get me", () => {
      it("should retrieve the current user", () => {
        return pactum
          .spec()
          .get("/users/me")
          .withHeaders({Authorization: "Bearer $S{userAccessToken}"})
          .expectStatus(200)
          // .inspect()
      })
    });

    describe("Edit user", () => {
      it("should edit the user", () => {
        const dto: EditUserDto = {
          firstName: "KhalidIbnWalid",
          email: "KhalidIbnWalid@gmail.com"
        }
        return pactum
          .spec()
          .patch("/users")
          .withHeaders({Authorization: "Bearer $S{userAccessToken}"})
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email)
          // .inspect()
      })
    });
  });

  describe("Bookmarks", () => {
    describe("Get empty Bookmarks", () => {
      it("should get empty bookmarks", () => {
        return pactum
          .spec()
          .get("/bookmarks")
          .withHeaders({Authorization: "Bearer $S{userAccessToken}"})
          .expectStatus(200)
          .expectBody([])
          // .inspect()
      })
    });


    describe("Create Bookmarks", () => {
      const dto: CreateBookmarkDto = {
        title: "First Bookmark",
        link: "https://www.youtube.com/watch?v=ZeVw2QNyG_U&t=537s"
      }
      it("should create a bookmark", () => {
        return pactum
          .spec()
          .post("/bookmarks")
          .withHeaders({Authorization: "Bearer $S{userAccessToken}"})
          .withBody(dto)
          .expectStatus(201)
          .stores("bookmarkId", "id")
          // .inspect()
      })
    })

    describe("Get Bookmarks", () => {
      it("should get bookmarks", () => {
        return pactum
          .spec()
          .get("/bookmarks")
          .withHeaders({Authorization: "Bearer $S{userAccessToken}"})
          .expectStatus(200)
          .expectJsonLength(1)
          // .inspect()
      })
    })

    describe("Get Bookmark by id", () => {
      it("should get bookmark by id", () => {
        return pactum
          .spec()
          .get("/bookmarks/{id}")
          .withPathParams("id", "$S{bookmarkId}")
          .withHeaders({Authorization: "Bearer $S{userAccessToken}"})
          .expectStatus(200)
          .expectBodyContains("$S{bookmarkId}")
          // .inspect()
      });
    })

    describe("Edit Bookmark by id", () => {
      const dto: EditBookmarkDto = {
        title: "Doing my first T3 stack app guided by Theo",
        description: "I do my first T3 stack app while being guided by Theo, the creator of the stack. We also talked and answered some of the questions from the chat."
      }
      it("should edit bookmark by id", () => {
        return pactum
          .spec()
          .patch("/bookmarks/{id}")
          .withPathParams("id", "$S{bookmarkId}")
          .withHeaders({Authorization: "Bearer $S{userAccessToken}"})
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description)
          // .inspect()
      });
    });

    describe("Delete Bookmark by id", () => {
      it("should delete bookmark by id", () => {
        return pactum
          .spec()
          .delete("/bookmarks/{id}")
          .withPathParams("id", "$S{bookmarkId}")
          .withHeaders({Authorization: "Bearer $S{userAccessToken}"})
          .expectStatus(204)
          .inspect()
      });
      it("should now be an empty bookmark", () => {
        return pactum 
          .spec()
          .get("/bookmarks")
          .withHeaders({Authorization: "Bearer $S{userAccessToken}"})
          .expectStatus(200)
          .expectJsonLength(0)
      })
    });

  });
});