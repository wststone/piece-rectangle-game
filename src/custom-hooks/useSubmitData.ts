import axios from "axios";
import { PanguAPIResponse } from "@contexts/WindowDataTypes";
import { useEffect, useState } from "react";

interface ISubmitParameter {
	gt_id?: number;
	game_hard?: number;
	game_level?: number;
	use_time: number;
	score?: number;
	auth_cookie: string;
}

export interface IExpData {
	add_exp: number;
	total_exp: number;
	total_time: number;
}

export default function useSubmitData({
	gt_id,
	game_hard,
	game_level,
	use_time,
	auth_cookie,
}: ISubmitParameter) {
	const [expData, setExpData] = useState<number>(0);
	useEffect(() => {
		const submit = async () => {
			const { data } = await axios.post<PanguAPIResponse<IExpData>>(
				"/api/common/computer/game_save_record",
				{
					gt_id,
					game_hard,
					game_level,
					use_time,
					auth_cookie,
				}
			);
			if (data.code === 200) {
				const { add_exp } = data.data;
				if (add_exp > 0) setExpData(add_exp);
			}
		};
		if (use_time && gt_id && game_hard && game_level && auth_cookie) {
			submit();
		}
	}, [auth_cookie, game_hard, game_level, gt_id, use_time]);

	return expData;
}

// "pangu.php",
// {
// 	api_url: "api/common/computer/game_save_record",
// 	gt_id,
// 	game_hard,
// 	game_level,
// 	use_time,
// 	auth_cookie,
// }
