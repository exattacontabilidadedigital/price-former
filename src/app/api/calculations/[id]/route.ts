import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"
import { getCalculation } from "@/app/actions/calculation-actions"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const calculation = await getCalculation(params.id)
    
    if (!calculation) {
      return NextResponse.json({ error: "Calculation not found" }, { status: 404 })
    }

    return NextResponse.json(calculation)
  } catch (error) {
    console.error("Error fetching calculation:", error)
    return NextResponse.json(
      { error: "Failed to fetch calculation" },
      { status: 500 }
    )
  }
}