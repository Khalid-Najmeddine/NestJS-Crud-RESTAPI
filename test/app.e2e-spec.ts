import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaService } from "../src/prisma/prisma.service";
import { AppModule } from "../src/app.module";


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

    prisma = app.get(PrismaService);
    await prisma.cleanDB();
  });

  afterAll(() => {
    app.close()
  });

  describe("Authentication", () => {
    describe("Signup", () => {
      it.todo("User Should Signup")
    });
    describe("Signin", () => {});
      it.todo("User Should Signin")
  });

  describe("User", () => {
    describe("Get me", () => {});
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