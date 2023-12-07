const express = require('express')
const router = express.Router()
const { ethers } = require('ethers')

const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
const contractAddress = '' // 填写智能合约地址
const contractABI = [] // 填写智能合约ABI

// 获取区块链数据的路由
router.get('/getBlockchainData', async (req, res) => {
  const contract = new ethers.Contract(contractAddress, contractABI, provider)

  try {
    const result = await contract.getData()
    res.json({ data: result })
  } catch (error) {
    res.status(500).json({ error: 'Failed to get data' })
  }
})

// 存储数据到区块链的路由
router.post('/storeBlockchainData', async (req, res) => {
  const { data, userAccount } = req.body

  if (!data) {
    return res.status(400).json({ error: 'Data is required' })
  }

  try {
    const contract = new ethers.Contract(contractAddress, contractABI, provider)
    const transaction = await contract.connect(userAccount).storeData(data)

    await transaction.wait()

    res.json({ message: 'Data stored successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to store data on the blockchain' })
  }
})

module.exports = router
