import is from "@sindresorhus/is";
import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { educationService } from "../services/educationService";

const educationRouter = Router();

//학력 추가
educationRouter.post("/educations", login_required, async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }
    const userId = req.currentUserId;
    const { school, major, position } = req.body;

    const newEducation = await educationService.addEducation({
      userId,
      school,
      major,
      position,
    });

    if (newEducation.errorMessage) {
      throw new Error(newEducation.errorMessage);
    }
    res.status(201).json(newEducation);
  } catch (error) {
    next(error);
  }
});

// 나의 학력 조회
educationRouter.get(
  "/educations/:userId",
  login_required,
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const educationList = await educationService.getEducationList({
        userId,
      });

      if (educationList.errorMessage) {
        throw new Error(educationList.errorMessage);
      }

      res.status(200).json(educationList);
    } catch (error) {
      next(error);
    }
  }
);

// 나의 학력 편집, 업데이트
educationRouter.patch(
  "/educations/:educationId",
  login_required,
  async (req, res, next) => {
    try {
      if (is.emptyObject(req.body)) {
        throw new Error("업데이트 할 학력 데이터를 포함하여 요청해주세요.");
      }
      const userId = req.currentUserId;
      const { educationId } = req.params;
      const toUpdate = req.body;

      const updatedEducation = await educationService.updateEducation({
        userId,
        educationId,
        toUpdate,
      });

      if (updatedEducation.errorMessage) {
        throw new Error(updatedEducation.errorMessage);
      }
      res.status(200).json(updatedEducation);
    } catch (error) {
      next(error);
    }
  }
);

// 개별 education 삭제
educationRouter.delete(
  "/educations/:educationId",
  login_required,
  async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const { educationId } = req.params;

      const deletedCount = await educationService.deleteEducation({
        userId,
        educationId,
      });

      if (deletedCount.errorMessage) {
        throw new Error(deletedCount.errorMessage);
      }

      res.status(200).json(deletedCount);
    } catch (error) {
      next(error);
    }
  }
);

export { educationRouter };