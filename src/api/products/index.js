import express from "express"
import ProductsModel from "./model.js"

const productsRouter = express.Router()

productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await ProductsModel.find()
    res.send(products)
  } catch (error) {
    next(error)
  }
})

productsRouter.post("/", async (req, res, next) => {
  try {
    const newProduct = new ProductsModel(req.body)
    const { _id } = await newProduct.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

productsRouter.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    const { name } = req.body
    const updatedProduct = await ProductsModel.findByIdAndUpdate(id, { name }, { new: true })
    if (!updatedProduct) {
      return res.sendStatus(404)
    }
    res.send(updatedProduct)
  } catch (error) {
    next(error)
  }
})

productsRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    const deletedProduct = await ProductsModel.findByIdAndDelete(id)
    if (!deletedProduct) {
      return res.sendStatus(404)
    }
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})


export default productsRouter
